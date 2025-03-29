import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InfoIcon, AlertCircle } from "lucide-react";
import { useChat } from "@/context/ChatContext";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  // const { setApiKey: saveApiKey, hasApiKey } = useChat();
  const { setApiKey: saveApiKey, isApiKey } = useChat();

  useEffect(() => {
    // Try to load from localStorage when the dialog opens
    if (open) {
      const savedKey = localStorage.getItem("chatgpt_api_key") || "";
      setApiKey(savedKey);
    }
  }, [open]);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ChatGPT API Settings</DialogTitle>
          <DialogDescription>
            Configure your OpenAI API key to use the ChatGPT SDK.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="apiKey" className="font-medium">
              OpenAI API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />

            <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
              <InfoIcon size={16} className="mt-0.5 shrink-0" />
              <p>
                Your API key is stored locally in your browser and never sent to
                our servers. Get your API key from the{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenAI dashboard
                </a>
                .
              </p>
            </div>

            {!isApiKey && apiKey === "" && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-destructive/10 rounded-md text-sm text-destructive">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>An API key is required to use the ChatGPT functionality.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
