import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useSaveRoom } from "@/hooks/use-rooms";
import type { Room } from "@shared/schema";

// Validation schema
const roomFormSchema = z.object({
    name: z.string().min(1, "Room name is required"),
    type: z.string().min(1, "Room type is required"),
    price: z.string().min(1, "Price is required"),
    status: z.string().default("available"),
    projectId: z.string().optional(),
    description: z.string().optional(),
    amenities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface RoomFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    room?: Room | null; // Nếu có room = Edit mode, không có = Create mode
}

export function RoomFormDialog({ open, onOpenChange, room }: RoomFormDialogProps) {
    const saveRoom = useSaveRoom();
    const [amenityInput, setAmenityInput] = useState("");
    const [imageInput, setImageInput] = useState("");

    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomFormSchema),
        defaultValues: {
            name: room?.name || "",
            type: room?.type || "",
            price: room?.price?.toString() || "",
            status: room?.status || "available",
            projectId: room?.projectId?.toString() || "",
            description: room?.description || "",
            amenities: Array.isArray(room?.amenities) ? room.amenities : [],
            images: Array.isArray(room?.images) ? room.images : [],
        },
    });

    const onSubmit = (data: RoomFormValues) => {
        saveRoom.mutate(
            {
                ...(room?.id && { id: room.id }), // Nếu có ID = UPDATE
                name: data.name,
                type: data.type,
                price: parseInt(data.price),
                status: data.status,
                projectId: data.projectId ? parseInt(data.projectId) : undefined,
                description: data.description,
                amenities: data.amenities,
                images: data.images,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            }
        );
    };

    const addAmenity = () => {
        if (amenityInput.trim()) {
            const currentAmenities = form.getValues("amenities");
            form.setValue("amenities", [...currentAmenities, amenityInput.trim()]);
            setAmenityInput("");
        }
    };

    const removeAmenity = (index: number) => {
        const currentAmenities = form.getValues("amenities");
        form.setValue(
            "amenities",
            currentAmenities.filter((_, i) => i !== index)
        );
    };

    const addImage = () => {
        if (imageInput.trim()) {
            const currentImages = form.getValues("images");
            form.setValue("images", [...currentImages, imageInput.trim()]);
            setImageInput("");
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images");
        form.setValue(
            "images",
            currentImages.filter((_, i) => i !== index)
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {room ? "Edit Room" : "Add New Room"}
                    </DialogTitle>
                    <DialogDescription>
                        {room
                            ? "Update the room information below."
                            : "Fill in the details to create a new room."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Room Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Deluxe Garden View" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Type & Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Type *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="single">Single</SelectItem>
                                                <SelectItem value="double">Double</SelectItem>
                                                <SelectItem value="twin">Twin</SelectItem>
                                                <SelectItem value="suite">Suite</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="occupied">Occupied</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Price & Project ID */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Night (VND) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g., 800000"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {field.value && `${parseInt(field.value).toLocaleString('vi-VN')} ₫`}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project ID (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="e.g., 1"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the room features and highlights..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Amenities */}
                        <FormField
                            control={form.control}
                            name="amenities"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amenities</FormLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="e.g., WiFi, Air Conditioning"
                                            value={amenityInput}
                                            onChange={(e) => setAmenityInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addAmenity();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addAmenity} variant="secondary">
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {field.value.map((amenity, index) => (
                                            <Badge key={index} variant="secondary" className="gap-1">
                                                {amenity}
                                                <X
                                                    size={14}
                                                    className="cursor-pointer hover:text-destructive"
                                                    onClick={() => removeAmenity(index)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Images */}
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URLs</FormLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://example.com/image.jpg"
                                            value={imageInput}
                                            onChange={(e) => setImageInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addImage();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addImage} variant="secondary">
                                            Add
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {field.value.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image}
                                                    alt={`Room ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saveRoom.isPending}>
                                {saveRoom.isPending
                                    ? "Saving..."
                                    : room
                                        ? "Update Room"
                                        : "Create Room"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
