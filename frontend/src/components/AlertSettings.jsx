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

export default function AlertSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [tradeVolumeAlerts, setTradeVolumeAlerts] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alert Settings</CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Email Frequency</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Daily" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="off">Turn Off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label>Enable Email Alerts</Label>
          <Switch
            checked={emailAlerts}
            onCheckedChange={setEmailAlerts}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Notify on High Volume Trades</Label>
          <Switch
            checked={tradeVolumeAlerts}
            onCheckedChange={setTradeVolumeAlerts}
          />
        </div>
      </CardContent>
    </Card>
  );
}
