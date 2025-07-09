// src/components/AlertSettings.jsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AlertSettings({ politicianName }) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [tradeVolumeAlerts, setTradeVolumeAlerts] = useState(false);
  const [newPoliticianAlerts, setNewPoliticianAlerts] = useState(false); // For global only
  const [emailFrequency, setEmailFrequency] = useState("daily");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {politicianName ? `Alert Settings for ${politicianName}` : "Global Alert Settings"}
        </CardTitle>
        <CardDescription>
          {politicianName
            ? `Get notified about new trades, large transactions, or news updates for ${politicianName}.`
            : "Manage notifications about major trades, news, and market activity across all politicians you follow."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Frequency */}
        <div className="space-y-2">
          <Label>Email Frequency</Label>
          <Select value={emailFrequency} onValueChange={setEmailFrequency}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="off">Turn Off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enable Alerts */}
        <div className="flex items-center justify-between">
          <Label>
            {politicianName
              ? `Enable alerts for ${politicianName}`
              : "Enable global email alerts"}
          </Label>
          <Switch
            checked={emailAlerts}
            onCheckedChange={setEmailAlerts}
          />
        </div>

        {/* High Volume Trades */}
        <div className="flex items-center justify-between">
          <Label>
            {politicianName
              ? `Notify on high volume trades by ${politicianName}`
              : "Notify on high volume trades by any politician"}
          </Label>
          <Switch
            checked={tradeVolumeAlerts}
            onCheckedChange={setTradeVolumeAlerts}
          />
        </div>

        {/* New Politician Alerts (only show for global settings) */}
        {!politicianName && (
          <div className="flex items-center justify-between">
            <Label>Notify when a new politician is added</Label>
            <Switch
              checked={newPoliticianAlerts}
              onCheckedChange={setNewPoliticianAlerts}
            />
          </div>
        )}

        {/* Helper Note */}
        {!politicianName && (
          <div className="text-xs text-muted-foreground pt-4">
            These settings apply to all politicians you follow.<br />
            To set custom alerts for a specific politician, visit their profile or your <a href="/following" className="text-brand-600 underline">Following</a> page.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
