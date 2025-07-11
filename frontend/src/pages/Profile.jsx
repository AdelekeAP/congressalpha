// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import AlertSettings from "@/components/AlertSettings";

import { useUser } from "@/context/UserContext";
import { politicians } from "@/data/politicians";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Star, Bell, Eye, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

// Mock recent activity (replace with real API data if available)
const recentActivity = [
  { type: "alert", message: "Nancy Pelosi bought NVDA", time: "2 hours ago" },
  { type: "watch", message: "Started watching Dan Crenshaw", time: "1 day ago" },
  { type: "simulation", message: "Completed backtest simulation", time: "3 days ago" },
  { type: "alert", message: "Tech sector alert triggered", time: "5 days ago" },
];

export default function ProfilePage() {
  const { user, followed } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  // List of followed politicians with info
  const followedList = followed
    .map((name) => politicians[name] ? { name, ...politicians[name] } : null)
    .filter(Boolean);

  // Notification settings state
  const [notif, setNotif] = useState({
    trade: true,
    daily: true,
    weekly: false,
    account: true,
    push: true,
    newPolitician: false,
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Persist account updates (API/Context)
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header: avatar, name, email, stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {(user?.name || "U").split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{formData.name || "Your Name"}</CardTitle>
              <div className="text-sm text-muted-foreground">{formData.email || "youremail@email.com"}</div>
              <div className="text-xs mt-1 text-muted-foreground">{user?.joinDate && `Member since ${user.joinDate}`}</div>
              <div className="mt-2">
                <Badge variant="outline">Free Plan</Badge>
                {/* Replace with user?.plan if available */}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mt-4">
            <div>
              <span className="font-bold">{followedList.length}</span> politicians followed
            </div>
            <div>
              <Link to="/following" className="text-brand-600 hover:underline">View Following</Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* --- OVERVIEW --- */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions on CongressAlpha</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div>
                          {activity.type === "alert" && <Bell className="h-5 w-5 text-blue-500" />}
                          {activity.type === "watch" && <Eye className="h-5 w-5 text-green-500" />}
                          {activity.type === "simulation" && <TrendingUp className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Watched Politicians */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Watched Politicians</CardTitle>
                  <CardDescription>Politicians you're currently following</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {followedList.length === 0 && (
                      <div className="text-muted-foreground text-sm">You’re not following anyone yet.</div>
                    )}
                    {followedList.map((p) => (
                      <div key={p.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={p.avatar} />
                            <AvatarFallback>
                              {p.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.party} - {p.state}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm" disabled>
                            <Star className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <Link to="/politicians">Browse All Politicians</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- ACCOUNT --- */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
              <Separator />
              {/* Security: change password */}
              <div>
                <h3 className="text-lg font-medium mb-4">Security</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-muted-foreground">Last changed 3 months ago</div>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- NOTIFICATIONS --- */}
        <TabsContent value="notifications">
          <AlertSettings />
          <div className="text-xs text-muted-foreground pt-2">
            Manage how you’re notified about trading activity and platform events.
          </div>

        </TabsContent>

        {/* --- DATA --- */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data & Export</CardTitle>
              <CardDescription>Export your data and manage your CongressAlpha information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Export Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">Trading Data</div>
                      <div className="text-sm text-muted-foreground">
                        Export all your tracked trades and performance
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">Alert History</div>
                      <div className="text-sm text-muted-foreground">
                        Download your alert configurations and history
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">Watchlist</div>
                      <div className="text-sm text-muted-foreground">
                        Export your followed politicians and preferences
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                    <div className="text-left">
                      <div className="font-medium">Complete Profile</div>
                      <div className="text-sm text-muted-foreground">Full account data export</div>
                    </div>
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Star className="h-4 w-4 mr-2" />
                    Request Complete Data Archive
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Star className="h-4 w-4 mr-2" />
                    Delete All Personal Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Delete Account Permanently
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Account deletion is permanent and cannot be undone. All your data will be permanently removed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
