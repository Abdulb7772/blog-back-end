import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    console.log('Received category data:', req.body);
    const { title, description, coverImage } = req.body
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' })
    }

    // Create category data with automatic "active" status
    const categoryData = { 
      title, 
      description,
      status: 'active'  // Automatically set status to active
    };
    
    if (coverImage) {
      categoryData.coverImage = coverImage;
    }

    console.log('Attempting to save category...');
    const category = await Category.create(categoryData)
    console.log('Category saved successfully:', category._id);
    res.status(201).json(category)
  } catch (error) {
    console.log('Error saving category:', error.message);
    res.status(500).json({ message: 'Failed to create category', error: error.message })
  }
}

export const getCategories = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add search filter for multiple fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },        // Search in title
        { description: { $regex: search, $options: 'i' } }   // Search in description
      ];
    }
    
    // Add status filter
    if (status) {
      filter.status = status;
    }
    
    const categories = await Category.find(filter).sort({ createdAt: -1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' })
  }
}

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category', error: error.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findByIdAndDelete(id)
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully', category })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, coverImage, status } = req.body

    const updateData = { title, description }
    
    // Only update status if provided in the request
    if (status) {
      updateData.status = status
    }
    
    // Only update coverImage if a new one is provided
    if (coverImage) {
      updateData.coverImage = coverImage
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,        // return updated document
        runValidators: true
      }
    )

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.status(200).json(updatedCategory)

  } catch (error) {
    res.status(500).json({
      message: 'Failed to update category',
      error: error.message
    })
  }
}