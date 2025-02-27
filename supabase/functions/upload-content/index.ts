
// Follow Deno conventions for imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("CORS preflight request received")
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Upload content function called")
    const formData = await req.formData()
    const contentFile = formData.get('contentFile')
    const thumbnail = formData.get('thumbnail')
    const title = formData.get('title')
    const description = formData.get('description')
    const contentType = formData.get('contentType')
    
    console.log("Received data:", { 
      title, 
      description, 
      contentType, 
      contentFile: contentFile ? "File present" : "No file", 
      thumbnail: thumbnail ? "Thumbnail present" : "No thumbnail" 
    })

    if (!contentFile || !title || !contentType) {
      console.error("Required fields missing", { contentFile: !!contentFile, title: !!title, contentType: !!contentType })
      return new Response(
        JSON.stringify({ error: 'Required fields missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload content file
    const contentFileName = `${crypto.randomUUID()}.${contentFile.name.split('.').pop()}`
    console.log("Uploading content file:", contentFileName)
    
    const { data: contentData, error: contentError } = await supabase.storage
      .from('content_files')
      .upload(contentFileName, contentFile, {
        contentType: contentFile.type,
        upsert: false
      })

    if (contentError) {
      console.error("Content file upload error:", contentError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload content file', details: contentError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    let thumbnailPath = null
    if (thumbnail) {
      // Upload thumbnail if provided
      const thumbnailName = `${crypto.randomUUID()}.${thumbnail.name.split('.').pop()}`
      console.log("Uploading thumbnail:", thumbnailName)
      
      const { data: thumbData, error: thumbError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbnailName, thumbnail, {
          contentType: thumbnail.type,
          upsert: false
        })

      if (thumbError) {
        // If thumbnail upload fails, we should continue but log the error
        console.error('Thumbnail upload failed:', thumbError)
      } else {
        thumbnailPath = thumbnailName
      }
    }

    // Get the URL for the content file
    const { data: { publicUrl: contentUrl } } = supabase.storage
      .from('content_files')
      .getPublicUrl(contentFileName)

    // Get the URL for the thumbnail if it exists
    let thumbnailUrl = null
    if (thumbnailPath) {
      const { data: { publicUrl: thumbUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbnailPath)
      thumbnailUrl = thumbUrl
    }

    console.log("Got public URLs:", { contentUrl, thumbnailUrl })

    // Insert the content record
    const { data: content, error: dbError } = await supabase
      .from('content')
      .insert({
        title: title,
        description: description || null,
        content_type: contentType,
        content_url: contentUrl,
        thumbnail_url: thumbnailUrl,
        created_by: req.headers.get('x-user-id')
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error when saving content metadata:", dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save content metadata', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log("Content uploaded successfully:", content)
    return new Response(
      JSON.stringify({ 
        message: 'Content uploaded successfully',
        content: content
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error("Unexpected error in upload-content function:", error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
