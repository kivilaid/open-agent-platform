"use client";

import { useEffect, useState, forwardRef, ForwardedRef } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ConfigField,
  ConfigFieldRAG,
  ConfigFieldTool,
} from "@/features/chat/components/configuration-sidebar/config-field";
import { ConfigSection } from "@/features/chat/components/configuration-sidebar/config-section";
import { useConfigStore } from "@/features/chat/hooks/use-config-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import {
  ConfigurableFieldMCPMetadata,
  ConfigurableFieldRAGMetadata,
  ConfigurableFieldUIMetadata,
} from "@/types/configurable";
import { extractConfigurationsFromAgent } from "@/lib/ui-config";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents } from "@/hooks/use-agents";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import _ from "lodash";
import { useMCPContext } from "@/providers/MCP";
import { Search } from "@/components/ui/tool-search";
import { useSearchTools } from "@/hooks/use-search-tools";

export interface AIConfigPanelProps {
  className?: string;
  open: boolean;
}

export const ConfigurationSidebar = forwardRef<
  HTMLDivElement,
  AIConfigPanelProps
>(({ className, open }, ref: ForwardedRef<HTMLDivElement>) => {
  const { configsByAgentId, resetConfig } = useConfigStore();
  const { tools } = useMCPContext();
  const [agentId] = useQueryState("agentId");
  const [deploymentId] = useQueryState("deploymentId");
  const [configurations, setConfigurations] = useState<
    ConfigurableFieldUIMetadata[]
  >([]);
  const [toolConfigurations, setToolConfigurations] = useState<
    ConfigurableFieldMCPMetadata[]
  >([]);
  const [ragConfigurations, setRagConfigurations] = useState<
    ConfigurableFieldRAGMetadata[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { toolSearchTerm, debouncedSetSearchTerm, filteredTools } =
    useSearchTools(tools);
  const { getAgentConfigSchema, getAgent, updateAgent } = useAgents();
  const [supportedConfigs, setSupportedConfigs] = useState<string[]>([]);

  useEffect(() => {
    if (!agentId || !deploymentId || loading) return;

    setSupportedConfigs([]);
    setLoading(true);
    getAgent(agentId, deploymentId)
      .then(async (a) => {
        if (!a) {
          toast.error("Failed to get agent");
          return;
        }

        const schema = await getAgentConfigSchema(agentId, deploymentId);
        if (!schema) return;

        const { configFields, toolConfig, ragConfig } =
          extractConfigurationsFromAgent({
            agent: a,
            schema,
          });

        setConfigurations(configFields);

        // Set default config values based on configuration fields
        const { setDefaultConfig } = useConfigStore.getState();
        setDefaultConfig(agentId, configFields);

        if (toolConfig.length) {
          setDefaultConfig(`${agentId}:selected-tools`, toolConfig);
          setToolConfigurations(toolConfig);
          setSupportedConfigs((prev) => [...prev, "tools"]);
        }
        if (ragConfig.length) {
          setDefaultConfig(`${agentId}:rag`, ragConfig);
          setRagConfigurations(ragConfig);
          setSupportedConfigs((prev) => [...prev, "rag"]);
        }
      })
      .catch((e) => {
        console.error("Failed to get agent", e);
        toast.error("Failed to get agent");
      })
      .finally(() => setLoading(false));
  }, [agentId, deploymentId]);

  const handleSave = async () => {
    if (!agentId || !deploymentId) return;

    const updatedAgent = await updateAgent(agentId, deploymentId, {
      config: configsByAgentId[agentId],
    });
    if (!updatedAgent) {
      toast.error("Failed to update agent configuration");
      return;
    }

    toast.success("Agent configuration saved successfully");
  };

  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 right-0 z-10 h-screen border-l border-gray-200 bg-white shadow-lg transition-all duration-300",
        open ? "w-80 md:w-xl" : "w-0 overflow-hidden border-l-0",
        className,
      )}
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">Agent Configuration</h2>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!agentId) return;
                        resetConfig(agentId);
                      }}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Reset
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset the configuration to the last saved state</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleSave}
                    >
                      <Save className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save your changes to the agent</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Tabs
            defaultValue="general"
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <TabsList className="flex-shrink-0 justify-start bg-transparent px-4 pt-2">
              <TabsTrigger value="general">General</TabsTrigger>
              {supportedConfigs.includes("tools") && (
                <TabsTrigger value="tools">Tools</TabsTrigger>
              )}
              {supportedConfigs.includes("rag") && (
                <TabsTrigger value="rag">RAG</TabsTrigger>
              )}
            </TabsList>

            <ScrollArea className="flex-1 overflow-y-auto">
              <TabsContent
                value="general"
                className="m-0 p-4"
              >
                <ConfigSection title="Configuration">
                  {loading || !agentId ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    configurations.map((c, index) => (
                      <ConfigField
                        key={`${c.label}-${index}`}
                        id={c.label}
                        label={c.label}
                        type={
                          c.type === "boolean" ? "switch" : (c.type ?? "text")
                        }
                        description={c.description}
                        placeholder={c.placeholder}
                        options={c.options}
                        min={c.min}
                        max={c.max}
                        step={c.step}
                        agentId={agentId}
                      />
                    ))
                  )}
                </ConfigSection>
              </TabsContent>

              {supportedConfigs.includes("tools") && (
                <TabsContent
                  value="tools"
                  className="m-0 overflow-y-auto p-4"
                >
                  <ConfigSection title="Available Tools">
                    <Search
                      onSearchChange={debouncedSetSearchTerm}
                      placeholder="Search tools..."
                    />
                    {agentId &&
                      filteredTools.length > 0 &&
                      filteredTools.map((c, index) => (
                        <ConfigFieldTool
                          key={`${c.name}-${index}`}
                          id={c.name}
                          label={c.name}
                          description={c.description}
                          agentId={agentId}
                          toolId={toolConfigurations[0]?.label}
                        />
                      ))}
                    {agentId &&
                      filteredTools.length === 0 &&
                      toolSearchTerm && (
                        <p className="mt-4 text-center text-sm text-slate-500">
                          No tools found matching "{toolSearchTerm}".
                        </p>
                      )}
                    {!agentId && (
                      <p className="mt-4 text-center text-sm text-slate-500">
                        Select an agent to see tools.
                      </p>
                    )}
                    {agentId && tools.length === 0 && !toolSearchTerm && (
                      <p className="mt-4 text-center text-sm text-slate-500">
                        No tools available for this agent.
                      </p>
                    )}
                  </ConfigSection>
                </TabsContent>
              )}

              {supportedConfigs.includes("rag") && (
                <TabsContent
                  value="rag"
                  className="m-0 overflow-y-auto p-4"
                >
                  <ConfigSection title="Agent RAG">
                    {agentId && (
                      <ConfigFieldRAG
                        id={ragConfigurations[0].label}
                        label={ragConfigurations[0].label}
                        agentId={agentId}
                      />
                    )}
                  </ConfigSection>
                </TabsContent>
              )}
            </ScrollArea>
          </Tabs>
        </div>
      )}
    </div>
  );
});

ConfigurationSidebar.displayName = "ConfigurationSidebar";
