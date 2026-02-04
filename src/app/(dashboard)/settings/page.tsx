"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  X,
  User,
  Shield,
  Tag,
  Users,
  CreditCard,
  Webhook,
  FileText,
  Upload,
  KeyRound,
  MoreHorizontal,
  Pencil,
  ChevronLeft,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VALID_TABS = ["profile", "security", "tags", "custom-keys", "users", "billing", "api", "summary-template"];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "profile";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue={defaultTab} key={defaultTab} orientation="vertical" className="gap-6">
        <TabsList className="gap-2 p-3">
          <TabsTrigger value="profile" className="px-6 py-2.5">
            <User />
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="security" className="px-6 py-2.5">
            <Shield />
            Security
          </TabsTrigger>
          <TabsTrigger value="tags" className="px-6 py-2.5">
            <Tag />
            Tags
          </TabsTrigger>
          <TabsTrigger value="custom-keys" className="px-6 py-2.5">
            <KeyRound />
            Custom Keys
          </TabsTrigger>
          <TabsTrigger value="users" className="px-6 py-2.5">
            <Users />
            Users
          </TabsTrigger>
          <TabsTrigger value="billing" className="px-6 py-2.5">
            <CreditCard />
            Billing & Usage
          </TabsTrigger>
          <TabsTrigger value="api" className="px-6 py-2.5">
            <Webhook />
            API & Webhooks
          </TabsTrigger>
          <TabsTrigger value="summary-template" className="px-6 py-2.5">
            <FileText />
            Summary Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="tags">
          <TagsTab />
        </TabsContent>
        <TabsContent value="custom-keys">
          <CustomKeysTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
        <TabsContent value="api">
          <ApiTab />
        </TabsContent>
        <TabsContent value="summary-template">
          <SummaryTemplateTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Info</CardTitle>
          <CardDescription>
            Update your photo and personal details here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-medium">
                JD
              </div>
              <div className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This will be displayed on your profile.
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" placeholder="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue="john@example.com"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select disabled defaultValue="admin">
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select>
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="br">Brazil</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="ae">United Arab Emirates</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select>
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-12">(UTC-12:00) Baker Island</SelectItem>
                <SelectItem value="utc-8">(UTC-08:00) Pacific Time</SelectItem>
                <SelectItem value="utc-7">(UTC-07:00) Mountain Time</SelectItem>
                <SelectItem value="utc-6">(UTC-06:00) Central Time</SelectItem>
                <SelectItem value="utc-5">(UTC-05:00) Eastern Time</SelectItem>
                <SelectItem value="utc-0">(UTC+00:00) London, Dublin</SelectItem>
                <SelectItem value="utc+1">(UTC+01:00) Berlin, Paris</SelectItem>
                <SelectItem value="utc+3">(UTC+03:00) Moscow, Riyadh</SelectItem>
                <SelectItem value="utc+4">(UTC+04:00) Dubai, Baku</SelectItem>
                <SelectItem value="utc+5.5">(UTC+05:30) Mumbai, Kolkata</SelectItem>
                <SelectItem value="utc+8">(UTC+08:00) Singapore, Beijing</SelectItem>
                <SelectItem value="utc+9">(UTC+09:00) Tokyo, Seoul</SelectItem>
                <SelectItem value="utc+10">(UTC+10:00) Sydney, Melbourne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <Checkbox id="newsletter" />
            <Label htmlFor="newsletter" className="font-normal">
              Subscribe to newsletter
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update Password</Button>
        </CardFooter>
      </Card>

    </div>
  );
}

const TAG_PRESET_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
  "#1D4ED8",
];

function TagsTab() {
  const [tags, setTags] = useState([
    { id: "1", name: "VIP", description: "High-value customer requiring priority treatment", color: "#EAB308" },
    { id: "2", name: "New Lead", description: "Recently acquired contact not yet qualified", color: "#3B82F6" },
    { id: "3", name: "Follow Up", description: "Requires a follow-up call or message", color: "#22C55E" },
    { id: "4", name: "Urgent", description: "Time-sensitive request needing immediate attention", color: "#EF4444" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_PRESET_COLORS[5]);

  function handleAddTag() {
    if (!newTagName.trim()) return;
    setTags((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newTagName.trim(),
        description: newTagDescription.trim(),
        color: newTagColor,
      },
    ]);
    setNewTagName("");
    setNewTagDescription("");
    setNewTagColor(TAG_PRESET_COLORS[5]);
    setDialogOpen(false);
  }

  function handleDeleteTag(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
        <CardDescription>
          Manage tags used across your workspace for organizing contacts and
          conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
              <DialogDescription>
                Add a new tag to organize your contacts and conversations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Name</Label>
                <Input
                  id="tag-name"
                  placeholder="e.g. VIP, Callback, Interested"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-description">Description</Label>
                <Textarea
                  id="tag-description"
                  placeholder="Describe when this tag should be applied..."
                  rows={3}
                  value={newTagDescription}
                  onChange={(e) => setNewTagDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific for the AI to let them know when to use this tag.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  {TAG_PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          newTagColor === color
                            ? "var(--foreground)"
                            : "transparent",
                      }}
                      onClick={() => setNewTagColor(color)}
                    >
                      {newTagColor === color && (
                        <svg
                          className="h-3.5 w-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                  <div className="relative ml-1">
                    <input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="absolute inset-0 h-7 w-7 cursor-pointer opacity-0"
                    />
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40"
                      style={{
                        background: TAG_PRESET_COLORS.includes(newTagColor)
                          ? undefined
                          : newTagColor,
                      }}
                    >
                      {TAG_PRESET_COLORS.includes(newTagColor) && (
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Preview</Label>
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: newTagColor }}
                  >
                    {newTagName || "Tag name"}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                Create Tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Separator />
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between rounded-md border px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
                {tag.description && (
                  <span className="text-sm text-muted-foreground">
                    {tag.description}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDeleteTag(tag.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomKeysTab() {
  const [keys, setKeys] = useState([
    { id: "1", name: "Customer ID", description: "Unique identifier for the customer in external CRM" },
    { id: "2", name: "Plan Type", description: "The subscription plan the customer is on" },
    { id: "3", name: "Source", description: "How the customer was acquired (e.g. referral, organic)" },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyDescription, setNewKeyDescription] = useState("");

  function handleAddKey() {
    if (!newKeyName.trim()) return;
    setKeys((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newKeyName.trim(),
        description: newKeyDescription.trim(),
      },
    ]);
    setNewKeyName("");
    setNewKeyDescription("");
    setDialogOpen(false);
  }

  function handleDeleteKey(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Keys</CardTitle>
        <CardDescription>
          Manage custom keys used across your workspace for storing additional
          data on contacts and conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Key</DialogTitle>
              <DialogDescription>
                Add a new custom key to store additional data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="key-name">Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g. Customer ID, Plan Type"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-description">Description</Label>
                <Textarea
                  id="key-description"
                  placeholder="Describe what this key is used for..."
                  rows={3}
                  value={newKeyDescription}
                  onChange={(e) => setNewKeyDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific for the AI to let them know when to use this key.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddKey} disabled={!newKeyName.trim()}>
                Create Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Separator />
        <div className="space-y-2">
          {keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between rounded-md border px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{key.name}</Badge>
                {key.description && (
                  <span className="text-sm text-muted-foreground">
                    {key.description}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDeleteKey(key.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Member",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Member",
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+20");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setDepartment("");
    setEmail("");
    setPhone("+20");
    setPassword("");
    setRole("");
  };

  const handleInvite = () => {
    setUsers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `${firstName} ${lastName}`,
        email,
        role: role.charAt(0).toUpperCase() + role.slice(1),
      },
    ]);
    setDialogOpen(false);
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage team members and their roles in your workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite User</DialogTitle>
              <DialogDescription>
                Add a new team member to your workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    placeholder="e.g. Sarah"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    placeholder="e.g. Mostafa"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g. Marketing"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="e.g. sarahmo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-phone">Phone Number</Label>
                <Input
                  id="invite-phone"
                  type="tel"
                  placeholder="+20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-password">Password</Label>
                <Input
                  id="invite-password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">User Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="user-role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!firstName || !lastName || !email || !password || !role}
                onClick={handleInvite}
              >
                Invite User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <p className="font-medium">Free</p>
              <p className="text-sm text-muted-foreground">
                100 minutes &middot; 14 day trial
              </p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Your current usage for this billing period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Minutes</span>
              <span className="text-muted-foreground">34 / 100</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 w-[34%] rounded-full bg-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  PUT: "bg-yellow-100 text-yellow-700",
  PATCH: "bg-orange-100 text-orange-700",
  DELETE: "bg-red-100 text-red-700",
};

const PROPERTY_TYPES = [
  "String",
  "Number",
  "Boolean",
  "Object",
  "Array",
  "Integer",
] as const;

type LiveApiHeader = { id: string; key: string; value: string };
type LiveApiBodyProperty = {
  id: string;
  name: string;
  type: string;
  defaultValue: string;
  description: string;
  required: boolean;
};
type LiveApi = {
  id: string;
  name: string;
  description: string;
  method: string;
  url: string;
  headers: LiveApiHeader[];
  bodyProperties: LiveApiBodyProperty[];
};

function ApiTab() {
  const [showKey, setShowKey] = useState(false);
  const apiKey = "sk-olimi-xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const [liveApis, setLiveApis] = useState<LiveApi[]>([
    {
      id: "1",
      name: "Create Contact",
      description:
        "Creates a new contact in the CRM system with the provided details",
      method: "POST",
      url: "https://api.example.com/v1/contacts",
      headers: [
        { id: "h1", key: "Content-Type", value: "application/json" },
      ],
      bodyProperties: [
        {
          id: "p1",
          name: "email",
          type: "String",
          defaultValue: "",
          description: "Contact email address",
          required: true,
        },
        {
          id: "p2",
          name: "name",
          type: "String",
          defaultValue: "",
          description: "Contact full name",
          required: true,
        },
      ],
    },
    {
      id: "2",
      name: "Get Account Balance",
      description:
        "Retrieves the current account balance for a given customer ID",
      method: "GET",
      url: "https://api.example.com/v1/accounts/balance",
      headers: [],
      bodyProperties: [],
    },
    {
      id: "3",
      name: "Update Subscription",
      description:
        "Updates the subscription plan for an existing customer",
      method: "PUT",
      url: "https://api.example.com/v1/subscriptions",
      headers: [
        { id: "h2", key: "Content-Type", value: "application/json" },
      ],
      bodyProperties: [],
    },
  ]);

  // Form view state: null = list view, "new" = creating, string = editing id
  const [formView, setFormView] = useState<string | null>(null);

  // Form fields
  const [apiName, setApiName] = useState("");
  const [apiDescription, setApiDescription] = useState("");
  const [apiMethod, setApiMethod] = useState("POST");
  const [apiUrl, setApiUrl] = useState("");
  const [apiHeaders, setApiHeaders] = useState<LiveApiHeader[]>([]);
  const [bodyProperties, setBodyProperties] = useState<LiveApiBodyProperty[]>(
    []
  );

  // Add property dialog
  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);
  const [propName, setPropName] = useState("");
  const [propType, setPropType] = useState("String");
  const [propDefault, setPropDefault] = useState("");
  const [propDescription, setPropDescription] = useState("");
  const [propRequired, setPropRequired] = useState(false);

  // Validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setApiName("");
    setApiDescription("");
    setApiMethod("POST");
    setApiUrl("");
    setApiHeaders([]);
    setBodyProperties([]);
    setFormErrors({});
    setFormView(null);
  }

  function resetPropertyForm() {
    setPropName("");
    setPropType("String");
    setPropDefault("");
    setPropDescription("");
    setPropRequired(false);
    setEditingProperty(null);
  }

  function openNewForm() {
    resetForm();
    setFormView("new");
  }

  function openEditForm(id: string) {
    const api = liveApis.find((a) => a.id === id);
    if (!api) return;
    setApiName(api.name);
    setApiDescription(api.description);
    setApiMethod(api.method);
    setApiUrl(api.url);
    setApiHeaders(api.headers.map((h) => ({ ...h })));
    setBodyProperties(api.bodyProperties.map((p) => ({ ...p })));
    setFormErrors({});
    setFormView(id);
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!apiName.trim()) errors.name = "API name is required.";
    if (!apiDescription.trim()) errors.description = "Description is required.";
    if (!apiUrl.trim()) {
      errors.url = "Request URL is required.";
    } else if (
      !apiUrl.trim().startsWith("https://") &&
      !apiUrl.trim().startsWith("http://localhost")
    ) {
      errors.url = "URL must use HTTPS.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSaveApi() {
    if (!validateForm()) return;
    const apiData: LiveApi = {
      id: formView === "new" ? crypto.randomUUID() : formView!,
      name: apiName.trim(),
      description: apiDescription.trim(),
      method: apiMethod,
      url: apiUrl.trim(),
      headers: apiHeaders.filter((h) => h.key.trim()),
      bodyProperties,
    };

    if (formView === "new") {
      setLiveApis((prev) => [...prev, apiData]);
    } else {
      setLiveApis((prev) =>
        prev.map((a) => (a.id === formView ? apiData : a))
      );
    }
    resetForm();
  }

  function handleDeleteApi(id: string) {
    setLiveApis((prev) => prev.filter((a) => a.id !== id));
  }

  // Header management
  function addHeader() {
    setApiHeaders((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: "", value: "" },
    ]);
  }

  function updateHeader(id: string, field: "key" | "value", val: string) {
    setApiHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );
  }

  function removeHeader(id: string) {
    setApiHeaders((prev) => prev.filter((h) => h.id !== id));
  }

  // Body property management
  function handleSaveProperty() {
    if (!propName.trim()) return;
    const propData: LiveApiBodyProperty = {
      id: editingProperty ?? crypto.randomUUID(),
      name: propName.trim(),
      type: propType,
      defaultValue: propDefault.trim(),
      description: propDescription.trim(),
      required: propRequired,
    };

    if (editingProperty) {
      setBodyProperties((prev) =>
        prev.map((p) => (p.id === editingProperty ? propData : p))
      );
    } else {
      setBodyProperties((prev) => [...prev, propData]);
    }
    resetPropertyForm();
    setPropertyDialogOpen(false);
  }

  function openEditProperty(id: string) {
    const prop = bodyProperties.find((p) => p.id === id);
    if (!prop) return;
    setEditingProperty(id);
    setPropName(prop.name);
    setPropType(prop.type);
    setPropDefault(prop.defaultValue);
    setPropDescription(prop.description);
    setPropRequired(prop.required);
    setPropertyDialogOpen(true);
  }

  function removeProperty(id: string) {
    setBodyProperties((prev) => prev.filter((p) => p.id !== id));
  }

  // ── Form view ──
  if (formView !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={resetForm}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">
              {formView === "new"
                ? "API Request Configuration"
                : "Edit API Request Configuration"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure the API request details including URL, method, headers,
              and body.
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-name">
                API Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="api-name"
                placeholder="e.g. Create Contact, Get Balance"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The API name that will be used internally for this API request.
              </p>
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="api-description"
                placeholder="Describe what this API does..."
                rows={3}
                value={apiDescription}
                onChange={(e) => setApiDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                A clear description helps the AI understand when and how to use
                this tool effectively.
              </p>
              {formErrors.description && (
                <p className="text-xs text-destructive">
                  {formErrors.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Request Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Request Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">
                Request URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="api-url"
                placeholder="https://api.example.com/v1/endpoint"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The endpoint URL where the API request will be sent. Must use
                HTTPS.
              </p>
              {formErrors.url && (
                <p className="text-xs text-destructive">{formErrors.url}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-method">
                Request HTTP Method <span className="text-destructive">*</span>
              </Label>
              <Select value={apiMethod} onValueChange={setApiMethod}>
                <SelectTrigger id="api-method" className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The HTTP method to use for the request.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Request Headers */}
        <Card>
          <CardHeader>
            <CardTitle>Request Headers</CardTitle>
            <CardDescription>
              Custom headers to include with the request (e.g. Content-Type).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiHeaders.length > 0 && (
              <div className="space-y-2">
                {apiHeaders.map((header) => (
                  <div key={header.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) =>
                        updateHeader(header.id, "key", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) =>
                        updateHeader(header.id, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeHeader(header.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" onClick={addHeader}>
              <Plus className="mr-2 h-4 w-4" />
              Add Header
            </Button>
          </CardContent>
        </Card>

        {/* Request Body */}
        <Card>
          <CardHeader>
            <CardTitle>Request Body</CardTitle>
            <CardDescription>
              Define the structure of your request body using the schema builder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bodyProperties.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead className="w-[80px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bodyProperties.map((prop) => (
                      <TableRow key={prop.id}>
                        <TableCell className="font-medium">
                          {prop.name}
                          {prop.description && (
                            <p className="text-xs font-normal text-muted-foreground">
                              {prop.description}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{prop.type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {prop.defaultValue || "—"}
                        </TableCell>
                        <TableCell>
                          {prop.required ? (
                            <Badge variant="default">Required</Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              Optional
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEditProperty(prop.id)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeProperty(prop.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No properties defined.
                </p>
              </div>
            )}

            <Dialog
              open={propertyDialogOpen}
              onOpenChange={(open) => {
                setPropertyDialogOpen(open);
                if (!open) resetPropertyForm();
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingProperty ? "Edit Property" : "Add New Property"}
                  </DialogTitle>
                  <DialogDescription>
                    Define a property for the request body schema.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="prop-name">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="prop-name"
                      placeholder="e.g. email, customer_id"
                      value={propName}
                      onChange={(e) => setPropName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prop-type">Type</Label>
                    <Select value={propType} onValueChange={setPropType}>
                      <SelectTrigger id="prop-type" className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prop-default">Default Value</Label>
                    <Input
                      id="prop-default"
                      placeholder="e.g. active, 0, true"
                      value={propDefault}
                      onChange={(e) => setPropDefault(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Default or fixed value for this property.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prop-description">Description</Label>
                    <Textarea
                      id="prop-description"
                      placeholder="Describe what this property is for..."
                      rows={2}
                      value={propDescription}
                      onChange={(e) => setPropDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="prop-required"
                      checked={propRequired}
                      onCheckedChange={(checked) =>
                        setPropRequired(checked === true)
                      }
                    />
                    <Label htmlFor="prop-required" className="font-normal">
                      Required
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setPropertyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProperty}
                    disabled={!propName.trim()}
                  >
                    {editingProperty ? "Save Property" : "Add Property"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button onClick={handleSaveApi}>
            {formView === "new" ? "Save API" : "Save Changes"}
          </Button>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage API keys for integrating with external services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-md border p-3">
            <code className="flex-1 text-sm">
              {showKey ? apiKey : "sk-olimi-••••••••••••••••••••••••••••"}
            </code>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Generate New Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Configure webhook endpoints to receive real-time event
            notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[
              {
                url: "https://example.com/webhooks/messages",
                event: "All Recordings",
              },
              {
                url: "https://example.com/webhooks/contacts",
                event: "All Recordings",
              },
            ].map((webhook) => (
              <div
                key={webhook.url}
                className="flex items-center justify-between rounded-md border px-4 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{webhook.url}</p>
                  <p className="text-xs text-muted-foreground">
                    {webhook.event}
                  </p>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="https://your-app.com/webhook"
              className="flex-1"
            />
            <Button>Add Webhook</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live API Configurations</CardTitle>
          <CardDescription>
            Manage your API function tools and configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={openNewForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Live API
          </Button>

          {liveApis.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveApis.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell className="font-medium">
                        {api.name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {api.description}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${METHOD_COLORS[api.method] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {api.method}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-mono text-sm text-muted-foreground">
                        {api.url}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditForm(api.id)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteApi(api.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryTemplateTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary Template</CardTitle>
        <CardDescription>
          Customize the template used for generating AI conversation summaries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Textarea
            id="template"
            rows={12}
            placeholder="Enter your summary template..."
            defaultValue={`## Conversation Summary

**Customer:** {{customer_name}}
**Date:** {{date}}
**Agent:** {{agent_name}}

### Key Points
{{key_points}}

### Action Items
{{action_items}}

### Sentiment
{{sentiment}}`}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Available variables: {"{{customer_name}}"}, {"{{date}}"},{" "}
          {"{{agent_name}}"}, {"{{key_points}}"}, {"{{action_items}}"},{" "}
          {"{{sentiment}}"}, {"{{duration}}"}, {"{{channel}}"}
        </p>
      </CardContent>
      <CardFooter>
        <Button>Save Template</Button>
      </CardFooter>
    </Card>
  );
}
