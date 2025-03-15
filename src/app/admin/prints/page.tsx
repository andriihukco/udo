"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Save,
  Loader2,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { TypographyH1 } from "@/components/ui/typography";
import { usePrints, Print } from "@/contexts/PrintsContext";

export default function AdminPrintsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const {
    prints,
    isLoading: isPrintsLoading,
    addPrint,
    updatePrint,
    deletePrint,
  } = usePrints();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    svgFile: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user is admin or superadmin
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isPrintsLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, isPrintsLoading, router]);

  // Filter prints based on search query
  const filteredPrints = prints.filter(
    (print) =>
      print.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      print.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.type !== "image/svg+xml") {
        toast({
          title: "Invalid File Type",
          description: "Please upload an SVG file",
          variant: "destructive",
        });
        return;
      }

      setFormData((prev) => ({ ...prev, svgFile: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNew = () => {
    setSelectedPrint(null);
    setFormData({
      name: "",
      description: "",
      svgFile: null,
    });
    setPreviewUrl(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (print: Print) => {
    setSelectedPrint(print);
    setFormData({
      name: print.name,
      description: print.description,
      svgFile: null,
    });
    setPreviewUrl(print.svgUrl);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (print: Print) => {
    setSelectedPrint(print);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Print name is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPrint && !formData.svgFile) {
      toast({
        title: "Validation Error",
        description: "Please upload an SVG file",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (selectedPrint) {
        // Update existing print
        await updatePrint(selectedPrint.id, {
          name: formData.name,
          description: formData.description,
          ...(formData.svgFile && previewUrl ? { svgUrl: previewUrl } : {}),
        });
      } else {
        // Create new print
        await addPrint({
          name: formData.name,
          description: formData.description,
          svgUrl: previewUrl || "",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving print:", error);
      toast({
        title: "Error",
        description: selectedPrint
          ? "Failed to update print"
          : "Failed to create print",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle print deletion
  const handleDelete = async () => {
    if (!selectedPrint) return;

    setIsSaving(true);

    try {
      await deletePrint(selectedPrint.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting print:", error);
      toast({
        title: "Error",
        description: "Failed to delete print",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Show loading state
  if (isPrintsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <TypographyH1>{t("admin.managePrints")}</TypographyH1>
        <Button onClick={handleAddNew} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addNewPrint")}
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("admin.searchPrints")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  {t("admin.preview")}
                </TableHead>
                <TableHead>{t("admin.name")}</TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("admin.description")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("admin.created")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("admin.updated")}
                </TableHead>
                <TableHead className="w-[100px]">
                  {t("admin.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrints.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? t("admin.noSearchResults")
                      : t("admin.noPrints")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrints.map((print) => (
                  <TableRow key={print.id}>
                    <TableCell>
                      <div className="w-12 h-12 bg-accent/20 rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          src={print.svgUrl}
                          alt={print.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{print.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {print.description.length > 50
                        ? `${print.description.substring(0, 50)}...`
                        : print.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(print.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(print.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">{t("admin.edit")}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(print)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t("admin.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(print)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("admin.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Print Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPrint ? t("admin.editPrint") : t("admin.addNewPrint")}
            </DialogTitle>
            <DialogDescription>
              {selectedPrint
                ? t("admin.editPrintDescription")
                : t("admin.addPrintDescription")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t("admin.printName")} *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  {t("admin.printDescription")}
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="svgFile" className="text-sm font-medium">
                  {t("admin.svgFile")} {!selectedPrint && "*"}
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("svgFile")?.click()}
                    className="cursor-pointer"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {formData.svgFile
                      ? t("admin.changeFile")
                      : t("admin.uploadFile")}
                  </Button>
                  {(formData.svgFile || previewUrl) && (
                    <span className="text-sm text-muted-foreground">
                      {formData.svgFile?.name ||
                        previewUrl?.split("/").pop() ||
                        ""}
                    </span>
                  )}
                  <input
                    id="svgFile"
                    name="svgFile"
                    type="file"
                    accept=".svg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              {previewUrl && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    {t("admin.preview")}
                  </label>
                  <div className="bg-accent/10 rounded-md p-4 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-40 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.saving")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {selectedPrint
                      ? t("admin.updatePrint")
                      : t("admin.createPrint")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("admin.confirmDelete")}</DialogTitle>
            <DialogDescription>
              {t("admin.deleteConfirmationMessage")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">{selectedPrint?.name}</p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSaving}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("admin.deletePrint")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
