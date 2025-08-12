import { EditIcon, Save, X } from "lucide-react";
import React from "react";
import { Avatar } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Switch } from "../../../../components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Textarea } from "../../../../components/ui/textarea";

export const GuestProfileSection = (): JSX.Element => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedData, setEditedData] = React.useState({
    name: "John Smith",
    email: "john.smith@gmail.com",
    phone: "+1(555) 123-4567",
    roomType: "Suit",
    bedType: "King",
    viewPreference: "Ocean View",
    floorPreference: "High Floor",
    smokingPreference: "Yes",
    specialRequest: "No shellfish allergies, Prefers organic options when available",
    notes: "No shellfish allergies, Prefers organic options when available",
    communicationPreferences: {
      emailNotifications: true,
      marketingEmails: false,
      bookingReminders: false,
    },
    privacySettings: {
      marketingCommunications: true,
      analyticsPerformance: false,
      personalization: true,
      thirdPartySharing: false,
      cookiesTracking: false,
      locationData: false,
    },
  });

  // Guest profile data
  const guestInfo = {
    name: editedData.name,
    email: editedData.email,
    phone: editedData.phone,
    profilePic: "/profile-pic-of-a-user.svg",
  };

  // Stats cards data
  const statsCards = [
    { title: "Total Stays", value: "12", width: "w-[150px]" },
    { title: "Total Booking Amount", value: "$12,450", width: "w-[170px]" },
    { title: "Points", value: "10,320", width: "w-[150px]" },
    { title: "Average Stay (Nights)", value: "3.2", width: "w-[150px]" },
    {
      title: "Average Price (Per Night)",
      value: "$200-500",
      width: "w-[150px]",
    },
  ];

  // Room preferences data
  const roomPreferences = [
    { label: "Preferred Room Type", value: editedData.roomType, key: "roomType" },
    { label: "Bed Type", value: editedData.bedType, key: "bedType" },
    { label: "View Preference", value: editedData.viewPreference, key: "viewPreference" },
    { label: "Floor Preference", value: editedData.floorPreference, key: "floorPreference" },
    { label: "Smoking Preference", value: editedData.smokingPreference, key: "smokingPreference" },
  ];

  // Communication preferences data
  const communicationPreferences = [
    {
      title: "Email Notifications",
      description: "Receive booking confirmations and important updates",
      enabled: editedData.communicationPreferences.emailNotifications,
      key: "emailNotifications",
    },
    {
      title: "Marketing & Promotional Emails",
      description: "Receive special offers and travel deals",
      enabled: editedData.communicationPreferences.marketingEmails,
      key: "marketingEmails",
    },
    {
      title: "Booking Reminders",
      description: "Receive reminders about upcoming stays",
      enabled: editedData.communicationPreferences.bookingReminders,
      key: "bookingReminders",
    },
  ];

  // Privacy settings data
  const privacySettings = [
    {
      title: "Marketing Communications",
      description:
        "Receive promotional emails, special offers, and marketing materials",
      enabled: editedData.privacySettings.marketingCommunications,
      key: "marketingCommunications",
    },
    {
      title: "Analytics & Performance",
      description:
        "Help us improve our services by analyzing usage patterns and website performance",
      enabled: editedData.privacySettings.analyticsPerformance,
      key: "analyticsPerformance",
    },
    {
      title: "Personalization",
      description:
        "Customize your experience based on your preferences and booking history",
      enabled: editedData.privacySettings.personalization,
      key: "personalization",
    },
    {
      title: "Third-Party Sharing",
      description:
        "Share data with trusted partners for enhanced services and exclusive offers",
      enabled: editedData.privacySettings.thirdPartySharing,
      key: "thirdPartySharing",
    },
    {
      title: "Cookies & Tracking",
      description:
        "Allow cookies for website functionality and user experience improvements",
      enabled: editedData.privacySettings.cookiesTracking,
      key: "cookiesTracking",
    },
    {
      title: "Location Data",
      description:
        "Use your location to provide relevant hotel recommendations and local services",
      enabled: editedData.privacySettings.locationData,
      key: "locationData",
    },
  ];

  // Navigation tabs
  const navigationTabs = [
    { value: "bookings", label: "Bookings" },
    { value: "personal-information", label: "Personal Information" },
    { value: "preferences", label: "Preferences" },
    { value: "groups", label: "Groups" },
    { value: "loyalty", label: "Loyalty" },
  ];

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving data:", editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setEditedData({
      name: "John Smith",
      email: "john.smith@gmail.com",
      phone: "+1(555) 123-4567",
      roomType: "Suit",
      bedType: "King",
      viewPreference: "Ocean View",
      floorPreference: "High Floor",
      smokingPreference: "Yes",
      specialRequest: "No shellfish allergies, Prefers organic options when available",
      notes: "No shellfish allergies, Prefers organic options when available",
      communicationPreferences: {
        emailNotifications: true,
        marketingEmails: false,
        bookingReminders: false,
      },
      privacySettings: {
        marketingCommunications: true,
        analyticsPerformance: false,
        personalization: true,
        thirdPartySharing: false,
        cookiesTracking: false,
        locationData: false,
      },
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleCommunicationChange = (key: string, value: boolean) => {
    setEditedData(prev => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences,
        [key]: value,
      },
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setEditedData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [key]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col w-full items-start gap-3.5 py-5">
      <div className="flex flex-col w-full items-start gap-2.5">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-2.5 py-2.5">
            <h1 className="font-bold text-2xl leading-6 font-['Roboto',Helvetica]">
              Guest Profile
            </h1>
            <p className="text-[#707070] text-base leading-6 font-['Roboto',Helvetica]">
              Detailed View and Management
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-[5px] w-full">
          <Card className="w-full bg-[#f6f6f6] border-[#dfdfdf]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between pb-2.5 w-full">
                <Avatar className="w-[68px] h-[68px]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Profile pic of a"
                    src={guestInfo.profilePic}
                  />
                </Avatar>

                <div className="flex flex-col w-[200px] items-center justify-center gap-2.5">
                  {isEditing ? (
                    <>
                      <Input
                        value={editedData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full text-xl font-medium"
                      />
                      <Input
                        value={editedData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full text-[13px]"
                      />
                      <Input
                        value={editedData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full text-[13px]"
                      />
                    </>
                  ) : (
                    <>
                      <div className="font-medium text-black text-xl leading-normal font-['Roboto',Helvetica] w-full">
                        {guestInfo.name}
                      </div>
                      <div className="font-normal text-[#767676] text-[13px] leading-normal font-['Roboto',Helvetica] w-full">
                        {guestInfo.email}
                      </div>
                      <div className="font-normal text-[#767676] text-[13px] leading-normal font-['Roboto',Helvetica] w-full">
                        {guestInfo.phone}
                      </div>
                    </>
                  )}
                </div>

                {statsCards.map((card, index) => (
                  <Card
                    key={index}
                    className={`${card.width} h-[73px] bg-white border-[#d9dbdf]`}
                  >
                    <CardContent className="flex flex-col items-center justify-center gap-1.5 p-0 h-full">
                      <div className="font-medium text-black text-lg text-center leading-normal font-['Roboto',Helvetica] w-full">
                        {card.value}
                      </div>
                      <div className="font-normal text-[#767676] text-xs text-center leading-normal font-['Roboto',Helvetica] w-full">
                        {card.title}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="w-[150px] bg-white border-[#d9dbdf]">
                  <CardContent className="flex items-center justify-center p-0 h-[73px]">
                    <Badge className="bg-[#fff5b1] text-[#854d0f] font-medium text-xs px-2.5 py-1.5 rounded-[20px]">
                      Gold Member
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="flex h-[68px] items-center gap-[30px] w-full">
            <Tabs defaultValue="preferences" className="w-full">
              <TabsList className="bg-transparent h-full p-0 justify-start gap-[30px]">
                {navigationTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-[#2753eb] data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:shadow-none data-[state=inactive]:text-[#828898] data-[state=inactive]:font-medium px-0 py-0 h-10 bg-transparent`}
                  >
                    <span className="text-sm tracking-[1.12px] leading-6 font-['Roboto',Helvetica]">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-[#14a065] h-10 gap-1.5 hover:bg-[#0f8a54]">
                  <Save className="w-[15px] h-[15px]" />
                  <span className="font-normal text-white text-sm tracking-[0.28px] leading-[22px]">
                    Save
                  </span>
                </Button>
                <Button onClick={handleCancel} variant="outline" className="h-10 gap-1.5">
                  <X className="w-[15px] h-[15px]" />
                  <span className="font-normal text-sm tracking-[0.28px] leading-[22px]">
                    Cancel
                  </span>
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-[#2753eb] h-10 gap-1.5">
                <EditIcon className="w-[15px] h-[15px]" />
                <span className="font-normal text-white text-sm tracking-[0.28px] leading-[22px]">
                  Edit
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-5 w-full pb-5">
        <Card className="w-full bg-white rounded-[10px]">
          <CardContent className="p-5">
            <div className="flex items-start gap-2.5 py-[5px] w-full">
              <h3 className="font-medium text-black text-base leading-6 font-['Roboto',Helvetica]">
                Room and Stay Preferences
              </h3>
            </div>

            <div className="flex items-center gap-[59px] w-full">
              {roomPreferences.slice(0, 4).map((pref, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[280px] items-start py-2.5"
                >
                  <div className="flex h-[17px] items-center gap-2.5 w-full">
                    <div className="font-normal text-[#8a8c9a] text-[11px] text-center tracking-[-0.24px] leading-[16.5px] font-['Roboto',Helvetica]">
                      {pref.label}
                    </div>
                  </div>
                  <div className="flex h-[31px] items-center pt-0 pb-[3px] w-full">
                    <div className="flex w-[197px] items-center gap-2.5">
                      {isEditing ? (
                        <Select
                          value={pref.value}
                          onValueChange={(value) => handleInputChange(pref.key, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pref.key === "roomType" && (
                              <>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Deluxe">Deluxe</SelectItem>
                                <SelectItem value="Suit">Suite</SelectItem>
                                <SelectItem value="Presidential">Presidential</SelectItem>
                              </>
                            )}
                            {pref.key === "bedType" && (
                              <>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Double">Double</SelectItem>
                                <SelectItem value="Queen">Queen</SelectItem>
                                <SelectItem value="King">King</SelectItem>
                              </>
                            )}
                            {pref.key === "viewPreference" && (
                              <>
                                <SelectItem value="City View">City View</SelectItem>
                                <SelectItem value="Ocean View">Ocean View</SelectItem>
                                <SelectItem value="Mountain View">Mountain View</SelectItem>
                                <SelectItem value="Garden View">Garden View</SelectItem>
                              </>
                            )}
                            {pref.key === "floorPreference" && (
                              <>
                                <SelectItem value="Low Floor">Low Floor</SelectItem>
                                <SelectItem value="Mid Floor">Mid Floor</SelectItem>
                                <SelectItem value="High Floor">High Floor</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="font-normal text-black text-sm leading-normal font-['Roboto',Helvetica]">
                          {pref.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-10 pb-5 w-full">
              <div className="flex flex-col w-[280px] items-start py-2.5">
                <div className="flex h-[17px] items-center gap-2.5 w-full">
                  <div className="font-normal text-[#8a8c9a] text-[11px] text-center tracking-[-0.24px] leading-[16.5px] font-['Roboto',Helvetica]">
                    {roomPreferences[4].label}
                  </div>
                </div>
                <div className="flex h-[31px] items-center pt-0 pb-[3px] w-full">
                  <div className="flex w-[197px] items-center gap-2.5">
                    {isEditing ? (
                      <Select
                        value={editedData.smokingPreference}
                        onValueChange={(value) => handleInputChange("smokingPreference", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                    <div className="font-normal text-black text-sm leading-normal font-['Roboto',Helvetica]">
                        {editedData.smokingPreference}
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-medium text-black text-base leading-6 font-['Roboto',Helvetica]">
              Dietary Restrictions &amp; Special Request
            </h3>

            <div className="flex flex-col items-start gap-2.5 py-0.5 w-full">
              <div className="flex flex-col items-start gap-[5px] py-2.5 w-full">
                <div className="flex flex-col items-start justify-center w-full">
                  <div className="flex items-center gap-2.5 w-full">
                    <div className="font-normal text-[#8a8c9a] text-[11px] text-center tracking-[-0.24px] leading-[16.5px] font-['Roboto',Helvetica]">
                      Special Request
                    </div>
                  </div>
                  <div className="flex items-center pb-0.5 w-full">
                    {isEditing ? (
                      <Textarea
                        value={editedData.specialRequest}
                        onChange={(e) => handleInputChange("specialRequest", e.target.value)}
                        className="w-full min-h-[60px]"
                        placeholder="Enter special requests..."
                      />
                    ) : (
                      <div className="font-normal text-black text-sm text-center leading-normal font-['Roboto',Helvetica]">
                        {editedData.specialRequest}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full border-[#efefef]">
          <CardHeader className="p-5 pb-0">
            <CardTitle className="font-medium text-base leading-normal font-['Roboto',Helvetica]">
              Communication Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {communicationPreferences.map((pref, index) => (
              <div
                key={index}
                className="border-b border-[#d9d9d9] last:border-0"
              >
                <div className="flex items-center gap-[13px] pt-2.5 pb-5 w-full">
                  <div className="flex flex-col items-start gap-2.5 flex-1">
                    <div className="font-medium text-black text-sm leading-normal font-['Roboto',Helvetica]">
                      {pref.title}
                    </div>
                    <div className="font-normal text-[#707070] text-sm leading-normal font-['Roboto',Helvetica]">
                      {pref.description}
                    </div>
                  </div>
                  <div className="pr-5">
                    {isEditing ? (
                      <Switch
                        checked={pref.enabled}
                        onCheckedChange={(checked) => handleCommunicationChange(pref.key, checked)}
                      />
                    ) : (
                      <Badge
                        className={`px-2.5 py-1 rounded-[20px] ${
                          pref.enabled
                            ? "bg-[#14a0650d] text-[#14a065] border-[#14a065]"
                            : "bg-[#d9dbdf] text-[#8a8c9a] border-[#a8a6af]"
                        }`}
                      >
                        {pref.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="w-full border-[#efefef]">
          <CardHeader className="p-5 pb-0">
            <CardTitle className="font-medium text-lg leading-normal font-['Roboto',Helvetica]">
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {privacySettings.map((setting, index) => (
              <div
                key={index}
                className={`border-b border-[#d9d9d9] ${index === privacySettings.length - 1 ? "border-0" : ""}`}
              >
                <div className="flex items-center gap-[13px] pt-2.5 pb-5 w-full">
                  <div className="flex flex-col items-start gap-2.5 flex-1">
                    <div className="font-medium text-black text-sm leading-normal font-['Roboto',Helvetica]">
                      {setting.title}
                    </div>
                    <div className="font-normal text-[#707070] text-sm leading-normal font-['Roboto',Helvetica]">
                      {setting.description}
                    </div>
                  </div>
                  <div className="pr-5">
                    {isEditing ? (
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={(checked) => handlePrivacyChange(setting.key, checked)}
                      />
                    ) : (
                      <Badge
                        className={`px-2.5 py-1 rounded-[20px] ${
                          setting.enabled
                            ? "bg-[#14a0650d] text-[#14a065] border-[#14a065]"
                            : "bg-[#d9dbdf] text-[#8a8c9a] border-[#a8a6af]"
                        }`}
                      >
                        {setting.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="w-full bg-white rounded-[10px]">
          <CardContent className="p-5">
            <div className="flex items-start gap-2.5 py-[5px] w-full">
              <h3 className="font-medium text-black text-base leading-6 font-['Roboto',Helvetica]">
                Notes
              </h3>
            </div>

            <div className="flex flex-col items-start gap-[5px] py-2.5 w-full">
              <div className="flex flex-col items-start justify-center w-full">
                <div className="flex items-center gap-2.5 w-full">
                  <div className="font-normal text-[#8a8c9a] text-[11px] text-center tracking-[-0.24px] leading-[16.5px] font-['Roboto',Helvetica]">
                    Special Request
                  </div>
                </div>
                <div className="flex items-center pb-0.5 w-full">
                  {isEditing ? (
                    <Textarea
                      value={editedData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="w-full min-h-[60px]"
                      placeholder="Enter notes..."
                    />
                  ) : (
                    <div className="font-normal text-black text-sm text-center leading-normal font-['Roboto',Helvetica]">
                      {editedData.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
