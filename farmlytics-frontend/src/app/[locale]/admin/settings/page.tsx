"use client";

import { useUser } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const { user, logout } = useUser(); // ✅ Use your own context property
  const t = useTranslations("settings");

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Profile Information */}
      <Card className="border-green-600 shadow-sm">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle>{t("profileInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("name")}</Label>
              <Input
                defaultValue={user?.name || ""}
                className="border-green-500"
                readOnly
              />
            </div>
            <div>
              <Label>{t("phone")}</Label>
              <Input
                defaultValue={user?.phone || ""}
                className="border-green-500"
                readOnly
              />
            </div>
            <div>
              <Label>{t("district")}</Label>
              <Input
                defaultValue={user?.district || ""}
                className="border-green-500"
                readOnly
              />
            </div>
            <div>
              <Label>{t("sector")}</Label>
              <Input
                defaultValue={user?.sector || ""}
                className="border-green-500"
                readOnly
              />
            </div>
            <div>
              <Label>{t("farmSize")}</Label>
              <Input
                defaultValue={user?.farmSize || ""}
                className="border-green-500"
                readOnly
              />
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
            {t("saveChanges")}
          </Button>
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card className="border-green-600 shadow-sm">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle>{t("languageSettings")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Label>{t("chooseLanguage")}</Label>
          <Select defaultValue={user?.language || "en"}>
            <SelectTrigger className="border-green-500 mt-2">
              <SelectValue placeholder={t("chooseLanguage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="rw">Kinyarwanda</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-green-600 shadow-sm">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle>{t("notifications")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="market" />
            <Label htmlFor="market">{t("marketUpdates")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disease" />
            <Label htmlFor="disease">{t("diseaseAlerts")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="harvest" />
            <Label htmlFor="harvest">{t("harvestReminders")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="weather" />
            <Label htmlFor="weather">{t("weatherAlerts")}</Label>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-green-600 shadow-sm">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle>{t("dataManagement")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 w-full"
          >
            {t("downloadData")}
          </Button>
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 w-full"
          >
            {t("clearLogs")}
          </Button>
          <Button variant="destructive" className="w-full">
            {t("deleteAccount")}
          </Button>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="border-green-600 shadow-sm">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle>{t("accountSecurity")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 w-full"
          >
            {t("changePassword")}
          </Button>
          <Button
            onClick={logout}
            className="bg-green-600 hover:bg-green-700 text-white w-full"
          >
            {t("logout")}
          </Button>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-green-600 shadow-sm mb-6">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle>{t("helpSupport")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 w-full"
          >
            {t("contactSupport")}
          </Button>
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 w-full"
          >
            {t("reportProblem")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
