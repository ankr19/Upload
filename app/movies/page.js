import MovieBlogForm from '@/components/MovieBlogForm'
import React from 'react'
export const metadata = header()
export default function page() {
  return (
    <div>
      <MovieBlogForm />
    </div>
  )
}


function header(){
  return {
    title: "Latest Movies Review Adding Movies Blogs"
  }
}