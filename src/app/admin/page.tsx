"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface Print {
  _id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPrintsPage() {
  const { data: session } = useSession();
  const [prints, setPrints] = useState<Print[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrint, setEditingPrint] = useState<Print | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch prints on component mount
  useEffect(() => {
    fetchPrints();
  }, []);

  // Fetch prints from the API
  const fetchPrints = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/prints");
      const data = await response.json();
      setPrints(data);
    } catch (error) {
      console.error("Error fetching prints:", error);
      toast({
        title: "Error",
        description: "Failed to fetch prints",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check if the file is an SVG
      if (selectedFile.type !== "image/svg+xml") {
        toast({
          title: "Error",
          description: "Only SVG files are allowed",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Validate form data
      if (!formData.name || !formData.description) {
        toast({
          title: "Error",
          description: "Name and description are required",
          variant: "destructive",
        });
        return;
      }

      // If editing and no new file is selected, use the existing image URL
      let imageUrl = editingPrint ? editingPrint.image : "";

      // If a file is selected, upload it first
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      } else if (!editingPrint) {
        // If creating a new print and no file is selected
        toast({
          title: "Error",
          description: "Please select an image",
          variant: "destructive",
        });
        return;
      }

      // Prepare the request data
      const requestData = {
        ...formData,
        image: imageUrl,
      };

      // Send the request to create or update the print
      const url = editingPrint
        ? `/api/prints/${editingPrint._id}`
        : "/api/prints";
      const method = editingPrint ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to save print");
      }

      // Refresh the prints list
      await fetchPrints();

      // Reset the form
      resetForm();

      // Close the dialog
      setIsDialogOpen(false);

      // Show success message
      toast({
        title: "Success",
        description: `Print ${
          editingPrint ? "updated" : "created"
        } successfully`,
      });
    } catch (error) {
      console.error("Error saving print:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingPrint ? "update" : "create"} print`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle print deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this print?")) {
      return;
    }

    try {
      const response = await fetch(`/api/prints/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete print");
      }

      // Refresh the prints list
      await fetchPrints();

      // Show success message
      toast({
        title: "Success",
        description: "Print deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting print:", error);
      toast({
        title: "Error",
        description: "Failed to delete print",
        variant: "destructive",
      });
    }
  };

  // Handle edit button click
  const handleEdit = (print: Print) => {
    setEditingPrint(print);
    setFormData({
      name: print.name,
      description: print.description,
      image: print.image,
    });
    setPreviewUrl(print.image);
    setIsDialogOpen(true);
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setFile(null);
    setPreviewUrl(null);
    setEditingPrint(null);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Prints</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Print
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPrint ? "Edit Print" : "Add New Print"}
              </DialogTitle>
              <DialogDescription>
                {editingPrint
                  ? "Update the print details below."
                  : "Fill in the details below to create a new print."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Image (SVG only)</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/svg+xml"
                    onChange={handleFileChange}
                  />

                  {previewUrl && (
                    <div className="mt-2 relative h-40 w-full">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPrint ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : prints.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No prints found. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prints.map((print) => (
            <Card key={print._id}>
              <div className="relative h-48 w-full">
                <Image
                  src={print.image}
                  alt={print.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <CardHeader>
                <CardTitle>{print.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {print.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(print)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(print._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
