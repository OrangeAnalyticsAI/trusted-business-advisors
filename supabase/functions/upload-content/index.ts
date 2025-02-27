
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const contentFile = formData.get('contentFile')
    const thumbnail = formData.get('thumbnail')
    const title = formData.get('title')
    const description = formData.get('description')
    const contentType = formData.get('contentType')

    if (!contentFile || !title || !contentType) {
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
    const { data: contentData, error: contentError } = await supabase.storage
      .from('content_files')
      .upload(contentFileName, contentFile, {
        contentType: contentFile.type,
        upsert: false
      })

    if (contentError) {
      return new Response(
        JSON.stringify({ error: 'Failed to upload content file', details: contentError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    let thumbnailPath = null
    if (thumbnail) {
      // Upload thumbnail if provided
      const thumbnailName = `${crypto.randomUUID()}.${thumbnail.name.split('.').pop()}`
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
      return new Response(
        JSON.stringify({ error: 'Failed to save content metadata', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Content uploaded successfully',
        content: content
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
