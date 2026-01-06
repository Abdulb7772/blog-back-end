import Blog from '../models/Blog.js';

export const createBlog = async (req, res) => {
  try {
    const { title, content, coverImage, focusKeyword, category } = req.body

    if (!title || !content || !focusKeyword || !category) {
      return res.status(400).json({ message: 'Title, content, focus keyword and category are required' })
    }

    if (!Array.isArray(focusKeyword) || focusKeyword.length === 0) {
      return res.status(400).json({ message: 'At least one focus keyword is required' })
    }

    // Create blog with or without coverImage
    const blogData = { title, content, focusKeyword, category };
    if (coverImage) {
      blogData.coverImage = coverImage;
    }

    const blog = await Blog.create(blogData)
    res.status(201).json(blog)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog', error: error.message })
  }
}

export const getBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add search filter for multiple fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },        // Search in title
        { content: { $regex: search, $options: 'i' } },      // Search in content
        { focusKeyword: { $regex: search, $options: 'i' } }  // Search in keywords array
      ];
    }
    
    // Add category filter
    if (category) {
      filter.category = category;
    }
    
    const blogs = await Blog.find(filter).populate('category', 'title').sort({ createdAt: -1 })
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs' })
  }
}

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id).populate('category', 'title')
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.json(blog)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog', error: error.message })
  }
}

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params

    const blog = await Blog.findByIdAndDelete(id)
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    res.json({ message: 'Blog deleted successfully', blog })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blog', error: error.message })
  }
}

export const updateBlog = async (req, res) => {
try {
  const { id } = req.params
  const { title, content, focusKeyword, coverImage, category } = req.body

  const updateData = { title, content, focusKeyword, category }

  // Only update coverImage if a new one is provided
  if (coverImage) {
    updateData.coverImage = coverImage
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,        // return updated document
      runValidators: true
    }
  )

  if (!updatedBlog) {
    return res.status(404).json({ message: 'Blog not found' })
  }

  res.status(200).json(updatedBlog)

} catch (error) {
  res.status(500).json({
    message: 'Failed to update blog',
    error: error.message
  })
}
}