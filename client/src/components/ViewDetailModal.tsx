import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Calendar, Tag, MapPin, Users, DollarSign, Wifi, Coffee, Tv, Wind } from "lucide-react";
import type { Project, Post, Room } from "@shared/schema";

interface ViewDetailModalProps {
    open: boolean;
    onClose: () => void;
    data: Project | Post | Room | null;
    type: 'project' | 'post' | 'room';
}

export function ViewDetailModal({ open, onClose, data, type }: ViewDetailModalProps) {
    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <DialogTitle className="text-2xl font-display">
                            {type === 'project' && (data as Project).name}
                            {type === 'post' && (data as Post).title}
                            {type === 'room' && (data as Room).name}
                        </DialogTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Project Details */}
                    {type === 'project' && (
                        <ProjectDetail project={data as Project} />
                    )}

                    {/* Post Details */}
                    {type === 'post' && (
                        <PostDetail post={data as Post} />
                    )}

                    {/* Room Details */}
                    {type === 'room' && (
                        <RoomDetail room={data as Room} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Project Detail Component
function ProjectDetail({ project }: { project: Project }) {
    return (
        <div className="space-y-4">
            {/* Images */}
            {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {project.images.map((image, idx) => (
                        <img
                            key={idx}
                            src={image}
                            alt={`${project.name} ${idx + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{project.type}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium flex items-center gap-1">
                        <MapPin size={14} />
                        {project.location}
                    </p>
                </div>
            </div>

            {/* Slogan */}
            {project.slogan && (
                <div>
                    <p className="text-sm text-muted-foreground">Slogan</p>
                    <p className="text-lg italic">{project.slogan}</p>
                </div>
            )}

            {/* Description */}
            <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground leading-relaxed">{project.description}</p>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
                <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">
                                <Tag size={12} className="mr-1" />
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Links */}
            {project.airbnbUrl && (
                <div>
                    <a
                        href={project.airbnbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        View on Airbnb →
                    </a>
                </div>
            )}
        </div>
    );
}

// Post Detail Component
function PostDetail({ post }: { post: Post }) {
    return (
        <div className="space-y-4">
            {/* Published Date */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                </span>
                {post.author && <span>By {post.author}</span>}
            </div>

            {/* Content */}
            <div>
                <p className="text-sm text-muted-foreground mb-2">Content</p>
                <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
                <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-sm font-medium">Excerpt</p>
                    <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                </div>
            )}
        </div>
    );
}

// Room Detail Component
function RoomDetail({ room }: { room: Room }) {
    const amenityIcons: Record<string, any> = {
        'Wi-Fi': Wifi,
        'Coffee': Coffee,
        'TV': Tv,
        'Air Conditioning': Wind,
    };

    return (
        <div className="space-y-4">
            {/* Images */}
            {room.images && room.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {room.images.map((image, idx) => (
                        <img
                            key={idx}
                            src={image}
                            alt={`${room.name} ${idx + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{room.type}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium flex items-center gap-1">
                        <Users size={14} />
                        {room.capacity} guests
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium flex items-center gap-1">
                        <DollarSign size={14} />
                        ${room.price}/night
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={room.isAvailable ? "default" : "secondary"}>
                        {room.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                </div>
            </div>

            {/* Description */}
            <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
                <div>
                    <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                    <div className="grid grid-cols-2 gap-2">
                        {room.amenities.map((amenity, idx) => {
                            const Icon = amenityIcons[amenity] || Tag;
                            return (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Icon size={16} className="text-primary" />
                                    <span>{amenity}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
