import { useState } from "react";
import { motion } from "framer-motion";
import {
    Home,
    Settings,
    FileText,
    MessageSquare,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    Users,
    Star,
    DoorOpen,
    ChevronDown,
    Mail,
    Phone
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-projects";
import { useServices } from "@/hooks/use-services";
import { usePosts } from "@/hooks/use-posts";
import { useRooms, useDeleteRoom } from "@/hooks/use-rooms";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useMessages } from "@/hooks/use-messages";
import { RoomFormDialog } from "@/components/RoomFormDialog";
import { ProjectFormModal } from '@/components/ProjectFormModal';
import { PostFormModal } from '@/components/PostFormModal';
import { ServiceFormModal } from '@/components/ServiceFormModal';
import type { Room, Project, Post, Service } from "@shared/schema";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSaveProject, useDeleteProject } from '@/hooks/use-projects-crud';
import { useSavePost, useDeletePost } from '@/hooks/use-posts-crud';
import { useSaveService, useDeleteService } from '@/hooks/use-services-crud';
import { useUser, useLogout } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";

export default function Admin() {
    const { data: user, isLoading: userLoading } = useUser();
    const logoutMutation = useLogout();
    const [, setLocation] = useLocation();

    // ==========================================
    // 2. DATA & MUTATION HOOKS
    // ==========================================
    const deleteRoom = useDeleteRoom();
    const deleteProject = useDeleteProject();
    const deletePost = useDeletePost();
    const deleteService = useDeleteService();

    const { data: projects, isLoading: projectsLoading } = useProjects();
    const { data: services, isLoading: servicesLoading } = useServices();
    const { data: posts, isLoading: postsLoading } = usePosts();
    const { data: rooms, isLoading: roomsLoading } = useRooms();
    const { data: messages, isLoading: messagesLoading } = useMessages();
    const { data: dashboardData, isLoading: dashboardLoading } = useDashboardStats();

    // ==========================================
    // 3. UI STATE
    // ==========================================
    // Room state
    const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    // Project state
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Post state
    const [postDialogOpen, setPostDialogOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // Service state
    const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [quickAddOpen, setQuickAddOpen] = useState(false);

    // ==========================================
    // 4. AUTH GUARD (Kiểm tra Login)
    // ==========================================
    // Logic này phải nằm SAU khi khai báo tất cả Hooks để không gãy React Tree

    if (userLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        // Redirect nếu chưa login
        setLocation("/admin/login");
        return null;
    }

    // ==========================================
    // 5. PREPARE DATA (Stats)
    // ==========================================
    const stats = [
        {
            title: "Total Projects",
            value: dashboardData?.stats.projects.total || 0,
            icon: Home,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            trend: dashboardData?.stats.projects.growth
                ? `${dashboardData.stats.projects.growth > 0 ? '+' : ''}${dashboardData.stats.projects.growth}%`
                : "0%",
        },
        {
            title: "Services",
            value: dashboardData?.stats.services.total || 0,
            icon: Settings,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            trend: dashboardData?.stats.services.growth
                ? `${dashboardData.stats.services.growth > 0 ? '+' : ''}${dashboardData.stats.services.growth}%`
                : "0%",
        },
        {
            title: "Blog Posts",
            value: dashboardData?.stats.posts.total || 0,
            icon: FileText,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            trend: dashboardData?.stats.posts.growth
                ? `${dashboardData.stats.posts.growth > 0 ? '+' : ''}${dashboardData.stats.posts.growth}%`
                : "0%",
        },
        {
            title: "Messages",
            value: dashboardData?.stats.messages.total || 0,
            icon: MessageSquare,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            trend: dashboardData?.stats.messages.growth
                ? `${dashboardData.stats.messages.growth > 0 ? '+' : ''}${dashboardData.stats.messages.growth}%`
                : "0%",
        },
    ];

    // ==========================================
    // 6. HANDLERS
    // ==========================================
    // Room handlers
    const handleDeleteRoom = (roomId: number) => {
        if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            setDeletingRoomId(roomId);
            deleteRoom.mutate(roomId, {
                onSettled: () => {
                    setDeletingRoomId(null);
                }
            });
        }
    };

    const handleAddRoom = () => {
        setEditingRoom(null);
        setRoomDialogOpen(true);
    };

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setRoomDialogOpen(true);
    };


    // Project handlers
    const handleAddProject = () => {
        setEditingProject(null);
        setProjectDialogOpen(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setProjectDialogOpen(true);
    };

    const handleDeleteProject = (id: number, name: string) => {
        if (confirm(`Delete "${name}"?`)) {
            deleteProject.mutate(id);
        }
    };

    // Post handlers
    const handleAddPost = () => {
        setEditingPost(null);
        setPostDialogOpen(true);
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setPostDialogOpen(true);
    };

    const handleDeletePost = (id: number, title: string) => {
        if (confirm(`Delete "${title}"?`)) {
            deletePost.mutate(id);
        }
    };

    // Service handlers
    const handleAddService = () => {
        setEditingService(null);
        setServiceDialogOpen(true);
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setServiceDialogOpen(true);
    };

    const handleDeleteService = (id: number, title: string) => {
        if (confirm(`Delete "${title}"?`)) {
            deleteService.mutate(id);
        }
    };
    // const deleteRoom = useDeleteRoom();
    // const deleteProject = useDeleteProject();
    // const deletePost = useDeletePost();
    // const deleteService = useDeleteService();

    // // Room state
    // const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);
    // const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    // const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    // const { data: projects, isLoading: projectsLoading } = useProjects();
    // const { data: services, isLoading: servicesLoading } = useServices();
    // const { data: posts, isLoading: postsLoading } = usePosts();
    // const { data: rooms, isLoading: roomsLoading } = useRooms();
    // const { data: messages, isLoading: messagesLoading } = useMessages();
    // const { data: dashboardData, isLoading: dashboardLoading } = useDashboardStats();


    // // Auth state


    // // Project state
    // const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    // const [editingProject, setEditingProject] = useState<Project | null>(null);

    // // Post state
    // const [postDialogOpen, setPostDialogOpen] = useState(false);
    // const [editingPost, setEditingPost] = useState<Post | null>(null);

    // // Service state
    // const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
    // const [editingService, setEditingService] = useState<Service | null>(null);

    // const [quickAddOpen, setQuickAddOpen] = useState(false);

    // // Room handlers
    // const handleDeleteRoom = (roomId: number) => {
    //     if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
    //         setDeletingRoomId(roomId);
    //         deleteRoom.mutate(roomId, {
    //             onSettled: () => {
    //                 setDeletingRoomId(null);
    //             }
    //         });
    //     }
    // };

    // const handleAddRoom = () => {
    //     setEditingRoom(null);
    //     setRoomDialogOpen(true);
    // };

    // const handleEditRoom = (room: Room) => {
    //     setEditingRoom(room);
    //     setRoomDialogOpen(true);
    // };

    // // Project handlers
    // const handleAddProject = () => {
    //     setEditingProject(null);
    //     setProjectDialogOpen(true);
    // };

    // const handleEditProject = (project: Project) => {
    //     setEditingProject(project);
    //     setProjectDialogOpen(true);
    // };

    // const handleDeleteProject = (id: number, name: string) => {
    //     if (confirm(`Delete "${name}"?`)) {
    //         deleteProject.mutate(id);
    //     }
    // };

    // // Post handlers
    // const handleAddPost = () => {
    //     setEditingPost(null);
    //     setPostDialogOpen(true);
    // };

    // const handleEditPost = (post: Post) => {
    //     setEditingPost(post);
    //     setPostDialogOpen(true);
    // };

    // const handleDeletePost = (id: number, title: string) => {
    //     if (confirm(`Delete "${title}"?`)) {
    //         deletePost.mutate(id);
    //     }
    // };

    // // Service handlers
    // const handleAddService = () => {
    //     setEditingService(null);
    //     setServiceDialogOpen(true);
    // };

    // const handleEditService = (service: Service) => {
    //     setEditingService(service);
    //     setServiceDialogOpen(true);
    // };

    // const handleDeleteService = (id: number, title: string) => {
    //     if (confirm(`Delete "${title}"?`)) {
    //         deleteService.mutate(id);
    //     }
    // };

    // // Statistics - Sử dụng dữ liệu thật từ API
    // const stats = [
    //     {
    //         title: "Total Projects",
    //         value: dashboardData?.stats.projects.total || 0,
    //         icon: Home,
    //         color: "text-blue-500",
    //         bgColor: "bg-blue-500/10",
    //         trend: dashboardData?.stats.projects.growth
    //             ? `${dashboardData.stats.projects.growth > 0 ? '+' : ''}${dashboardData.stats.projects.growth}%`
    //             : "0%",
    //     },
    //     {
    //         title: "Services",
    //         value: dashboardData?.stats.services.total || 0,
    //         icon: Settings,
    //         color: "text-green-500",
    //         bgColor: "bg-green-500/10",
    //         trend: dashboardData?.stats.services.growth
    //             ? `${dashboardData.stats.services.growth > 0 ? '+' : ''}${dashboardData.stats.services.growth}%`
    //             : "0%",
    //     },
    //     {
    //         title: "Blog Posts",
    //         value: dashboardData?.stats.posts.total || 0,
    //         icon: FileText,
    //         color: "text-purple-500",
    //         bgColor: "bg-purple-500/10",
    //         trend: dashboardData?.stats.posts.growth
    //             ? `${dashboardData.stats.posts.growth > 0 ? '+' : ''}${dashboardData.stats.posts.growth}%`
    //             : "0%",
    //     },
    //     {
    //         title: "Messages",
    //         value: dashboardData?.stats.messages.total || 0,
    //         icon: MessageSquare,
    //         color: "text-orange-500",
    //         bgColor: "bg-orange-500/10",
    //         trend: dashboardData?.stats.messages.growth
    //             ? `${dashboardData.stats.messages.growth > 0 ? '+' : ''}${dashboardData.stats.messages.growth}%`
    //             : "0%",
    //     },
    //      const { data: user, isLoading: userLoading } = useUser();
    // const logoutMutation = useLogout();
    // const [, setLocation] = useLocation();

    // // Redirect if not logged in
    // if (!userLoading && !user) {
    //     setLocation("/admin/login");
    //     return null; // Stop rendering
    // }

    // if (userLoading) {
    //     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    // }   
    // ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
            <Navbar />

            {/* Admin Header */}
            <section className="pt-32 pb-12 px-4">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    Hello, {user?.fullName}
                                </h1>
                                <p className="text-muted-foreground text-lg">
                                    Manage your homestay business from one place
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Quick Add Dropdown Menu */}
                                <DropdownMenu open={quickAddOpen} onOpenChange={setQuickAddOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="lg" className="rounded-full gap-2">
                                            <Plus size={18} />
                                            Quick Add
                                            <ChevronDown size={16} className={`transition-transform ${quickAddOpen ? 'rotate-180' : ''}`} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                handleAddRoom();
                                                setQuickAddOpen(false);
                                            }}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <DoorOpen size={16} />
                                            <span>Add Room</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                handleAddPost();
                                                setQuickAddOpen(false);
                                            }}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <FileText size={16} />
                                            <span>Add Post</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                handleAddService();
                                                setQuickAddOpen(false);
                                            }}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <Settings size={16} />
                                            <span>Add Service</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Logout Button */}
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
                                    onClick={() => logoutMutation.mutate()}
                                >
                                    <LogOut size={18} />
                                    Logout
                                </Button>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {dashboardLoading ? (
                                // Loading skeleton
                                [1, 2, 3, 4].map((i) => (
                                    <Card key={i} className="border-border/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 bg-secondary/50 rounded-xl animate-pulse" />
                                                <div className="w-16 h-6 bg-secondary/50 rounded animate-pulse" />
                                            </div>
                                            <div className="w-20 h-8 bg-secondary/50 rounded animate-pulse mb-2" />
                                            <div className="w-24 h-4 bg-secondary/50 rounded animate-pulse" />
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                    </div>
                                                    <Badge variant="secondary" className="gap-1">
                                                        <TrendingUp size={12} />
                                                        {stat.trend}
                                                    </Badge>
                                                </div>
                                                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Management Tabs */}
            <section className="pb-20 px-4">
                <div className="container mx-auto">
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 mb-8 bg-secondary/50 p-1 rounded-xl">
                            <TabsTrigger value="projects" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Home size={16} className="mr-2" />
                                Projects
                            </TabsTrigger>
                            <TabsTrigger value="rooms" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <DoorOpen size={16} className="mr-2" />
                                Rooms
                            </TabsTrigger>
                            <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Settings size={16} className="mr-2" />
                                Services
                            </TabsTrigger>
                            <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <FileText size={16} className="mr-2" />
                                Posts
                            </TabsTrigger>
                            <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <MessageSquare size={16} className="mr-2" />
                                Messages
                            </TabsTrigger>
                        </TabsList>

                        {/* Projects Tab */}
                        <TabsContent value="projects">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">Projects Management</CardTitle>
                                            <CardDescription>Manage your homestay projects and listings</CardDescription>
                                        </div>
                                        <Button className="gap-2 rounded-full" onClick={handleAddProject}>
                                            <Plus size={18} />
                                            Add Project
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {projectsLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-24 bg-secondary/30 animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">

                                            {projects?.map((project) => (
                                                <motion.div
                                                    key={project.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-4 p-4 border border-border/50 rounded-xl hover:border-primary/50 hover:bg-secondary/30 transition-all group"
                                                >
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                                                        <img
                                                            src={project.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200"}
                                                            alt={project.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-lg">{project.name}</h3>
                                                            {project.isFeatured && (
                                                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                            )}
                                                            <Badge variant="outline" className="ml-2">{project.type}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {project.description}
                                                        </p>
                                                        <div className="flex gap-2 mt-2">
                                                            {Array.isArray(project.tags) && project.tags.map((tag: string) => (
                                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="gap-2"
                                                            onClick={() => handleEditProject(project)}
                                                        >
                                                            <Edit size={16} />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="gap-2 text-destructive hover:text-destructive"
                                                            onClick={() => handleDeleteProject(project.id, project.name)}
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Rooms Tab */}
                        <TabsContent value="rooms">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">Rooms Management</CardTitle>
                                            <CardDescription>Manage all rooms across your homestays</CardDescription>
                                        </div>
                                        <Button className="gap-2 rounded-full" onClick={handleAddRoom}>
                                            <Plus size={18} />
                                            Add Room
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {roomsLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-20 bg-secondary/30 animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-border/50">
                                                        <th className="text-left py-3 px-4 font-semibold">Room Name</th>
                                                        <th className="text-left py-3 px-4 font-semibold">Type</th>
                                                        <th className="text-left py-3 px-4 font-semibold">Price/Night</th>
                                                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                                                        <th className="text-left py-3 px-4 font-semibold">Amenities</th>
                                                        <th className="text-right py-3 px-4 font-semibold">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rooms?.map((room) => (
                                                        <motion.tr
                                                            key={room.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="border-b border-border/30 hover:bg-secondary/30 transition-colors group"
                                                        >
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                                                                        {room.images && Array.isArray(room.images) && room.images[0] ? (
                                                                            <img
                                                                                src={room.images[0]}
                                                                                alt={room.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <DoorOpen size={20} className="text-muted-foreground" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold">{room.name}</p>
                                                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                                                            {room.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <Badge variant="outline" className="capitalize">
                                                                    {room.type}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="font-semibold">
                                                                    {room.price?.toLocaleString('vi-VN')} ₫
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <Badge
                                                                    variant={room.status === 'available' ? 'default' : room.status === 'occupied' ? 'secondary' : 'destructive'}
                                                                    className="capitalize"
                                                                >
                                                                    {room.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                                    {room.amenities && Array.isArray(room.amenities) && room.amenities.slice(0, 2).map((amenity: string) => (
                                                                        <Badge key={amenity} variant="secondary" className="text-xs">
                                                                            {amenity}
                                                                        </Badge>
                                                                    ))}
                                                                    {room.amenities && Array.isArray(room.amenities) && room.amenities.length > 2 && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            +{room.amenities.length - 2}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button size="sm" variant="ghost" className="gap-2">
                                                                        <Eye size={16} />
                                                                        View
                                                                    </Button>
                                                                    <Button size="sm" variant="ghost" className="gap-2" onClick={() => handleEditRoom(room)}>
                                                                        <Edit size={16} />
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="gap-2 text-destructive hover:text-destructive"
                                                                        onClick={() => handleDeleteRoom(room.id)}
                                                                        disabled={deletingRoomId === room.id}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                        {deletingRoomId === room.id ? 'Deleting...' : 'Delete'}
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {(!rooms || rooms.length === 0) && (
                                                <div className="text-center py-12">
                                                    <DoorOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                                    <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Start by adding your first room
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Services Tab */}
                        <TabsContent value="services">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">Services Management</CardTitle>
                                            <CardDescription>Manage the services you offer</CardDescription>
                                        </div>
                                        <Button className="gap-2 rounded-full" onClick={handleAddService}>
                                            <Plus size={18} />
                                            Add Service
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {servicesLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-40 bg-secondary/30 animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {services?.map((service) => (
                                                <motion.div
                                                    key={service.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="p-6 border border-border/50 rounded-xl hover:border-primary/50 hover:shadow-lg transition-all group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -z-0" />
                                                    <div className="relative z-10">
                                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                                            <Settings className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                            {service.description}
                                                        </p>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-1 flex-1"
                                                                onClick={() => handleEditService(service)}
                                                            >
                                                                <Edit size={14} />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-1 text-destructive hover:text-destructive"
                                                                onClick={() => handleDeleteService(service.id, service.title)}
                                                            >
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Posts Tab */}
                        <TabsContent value="posts">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">Blog Posts Management</CardTitle>
                                            <CardDescription>Manage your blog content and stories</CardDescription>
                                        </div>
                                        <Button className="gap-2 rounded-full" onClick={handleAddPost}>
                                            <Plus size={18} />
                                            Add Post
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {postsLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="h-32 bg-secondary/30 animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {posts?.map((post) => (
                                                <motion.div
                                                    key={post.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-start gap-4 p-4 border border-border/50 rounded-xl hover:border-primary/50 hover:bg-secondary/30 transition-all group"
                                                >
                                                    <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                                                        <img
                                                            src={post.imageUrl || "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200"}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-lg">{post.title}</h3>
                                                            <Badge variant="outline">{post.category}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                            {post.content}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span>By {post.author || "Unknown"}</span>
                                                            <span>•</span>
                                                            <span>{new Date(post.publishedAt || "").toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="gap-2"
                                                            onClick={() => handleEditPost(post)}
                                                        >
                                                            <Edit size={16} />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="gap-2 text-destructive hover:text-destructive"
                                                            onClick={() => handleDeletePost(post.id, post.title)}
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Messages Tab */}
                        <TabsContent value="messages">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">Contact Messages</CardTitle>
                                            <CardDescription>View and manage customer inquiries</CardDescription>
                                        </div>
                                        <Button variant="outline" className="gap-2 rounded-full">
                                            <BarChart3 size={18} />
                                            Analytics
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {messagesLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-24 bg-secondary/30 animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    ) : messages && messages.length > 0 ? (
                                        <div className="space-y-4">
                                            {messages.map((message: any) => (
                                                <motion.div
                                                    key={message.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="p-4 border border-border/50 rounded-xl hover:border-primary/50 hover:bg-secondary/30 transition-all"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-lg">{message.name}</h3>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {new Date(message.createdAt).toLocaleDateString()}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                                <div className="flex items-center gap-1">
                                                                    <Mail size={14} />
                                                                    <span>{message.email}</span>
                                                                </div>
                                                                {message.phone && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Phone size={14} />
                                                                        <span>{message.phone}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-foreground/80">
                                                        {message.message}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Customer messages will appear here when they contact you
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Room Form Dialog */}
            <RoomFormDialog
                open={roomDialogOpen}
                onOpenChange={setRoomDialogOpen}
                room={editingRoom}
            />
            <ProjectFormModal
                open={projectDialogOpen}
                onClose={() => {
                    setProjectDialogOpen(false);
                    setEditingProject(null);
                }}
                project={editingProject}
            />
            <PostFormModal
                open={postDialogOpen}
                onClose={() => {
                    setPostDialogOpen(false);
                    setEditingPost(null);
                }}
                post={editingPost}
            />
            <ServiceFormModal
                open={serviceDialogOpen}
                onClose={() => {
                    setServiceDialogOpen(false);
                    setEditingService(null);
                }}
                service={editingService}
            />

            <Footer />
        </div>
    );
}
