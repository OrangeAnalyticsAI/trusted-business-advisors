
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentSidebar } from "@/components/content/ContentSidebar";
import { ContentMainArea } from "@/components/content/ContentMainArea";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  original_filename?: string;
  is_external_url?: boolean;
}

interface UserProfile {
  id: string;
  user_type: 'client' | 'consultant';
  email: string;
  full_name?: string;
}

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isConsultant, setIsConsultant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedMetaCategories, setSelectedMetaCategories] = useState<string[]>([]);
  
  const categories = [
    { id: "all", name: "All Content" },
    { id: "videos", name: "Videos" },
    { id: "documents", name: "Documents" },
    { id: "spreadsheets", name: "Spreadsheets" },
    { id: "presentations", name: "Presentations" },
    { id: "reports", name: "Reports" }
  ];
  
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Set up real-time subscription for content updates
  useEffect(() => {
    const channel = supabase
      .channel('content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content'
        },
        () => {
          console.log('Content changed, refreshing...');
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCategory, searchQuery, selectedMetaCategories]); // Re-subscribe when filters change

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Starting to check user session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("User is logged in, user ID:", session.user.id);
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            toast.error("Error fetching user profile");
          } else if (profileData) {
            console.log("Profile data retrieved:", profileData);
            console.log("User type:", profileData.user_type);
            setUserProfile(profileData);
            const isUserConsultant = profileData.user_type === 'consultant';
            console.log("Is user a consultant?", isUserConsultant);
            setIsConsultant(isUserConsultant);
          } else {
            console.log("No profile data found for user");
          }
          
          await fetchContent();
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Session or profile check error:", error);
        toast.error("Error checking user session");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();

    // Set up auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileData) {
          setUserProfile(profileData);
          setIsConsultant(profileData.user_type === 'consultant');
        }
      } else {
        setUserProfile(null);
        setIsConsultant(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchContent = async () => {
    try {
      setLoadingContent(true);
      
      // If we have selected meta categories, we need to join with content_categories
      if (selectedMetaCategories.length > 0) {
        // First get content IDs that have the selected categories
        const { data: contentIds, error: categoryError } = await supabase
          .from('content_categories')
          .select('content_id')
          .in('category_id', selectedMetaCategories);
          
        if (categoryError) {
          console.error("Error fetching content by categories:", categoryError);
          toast.error("Failed to filter by categories");
          return;
        }
        
        // If no content matches the selected categories, return empty array
        if (!contentIds || contentIds.length === 0) {
          setContentItems([]);
          return;
        }
        
        // Extract just the content IDs into an array
        const ids = contentIds.map(item => item.content_id);
        
        // Get all content that matches these IDs and other filters
        let query = supabase.from('content').select('*').in('id', ids);
        
        if (selectedCategory !== "all") {
          const contentType = selectedCategory.slice(0, -1);
          query = query.eq('content_type', contentType);
        }
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching content:", error);
          toast.error("Failed to load content");
        } else {
          setContentItems(data || []);
        }
      } else {
        // Regular query without category filtering
        let query = supabase.from('content').select('*');
        
        if (selectedCategory !== "all") {
          const contentType = selectedCategory.slice(0, -1);
          query = query.eq('content_type', contentType);
        }
        
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching content:", error);
          toast.error("Failed to load content");
        } else {
          setContentItems(data || []);
        }
      }
    } catch (error) {
      console.error("Content fetch error:", error);
      toast.error("Error loading content");
    } finally {
      setLoadingContent(false);
    }
  };
  
  useEffect(() => {
    console.log("isConsultant state changed:", isConsultant);
  }, [isConsultant]);
  
  useEffect(() => {
    if (!loading) {
      fetchContent();
    }
  }, [selectedCategory, searchQuery, selectedMetaCategories]);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <ContentHeader />

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ContentSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isConsultant={isConsultant}
            onContentAdded={fetchContent}
            selectedMetaCategories={selectedMetaCategories}
            setSelectedMetaCategories={setSelectedMetaCategories}
          />
          
          <ContentMainArea 
            loading={loading || loadingContent}
            contentItems={contentItems}
            userProfile={userProfile}
            isConsultant={isConsultant}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onContentDeleted={fetchContent}
          />
        </div>
      </div>
    </div>
  );
}
