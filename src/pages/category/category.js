import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    Box,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../auth/axiosInstance";

function Category() {
    const {register, handleSubmit, formState: {errors}, reset, setValue} = useForm();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [subCategoryOpen, setSubCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [subcategoryImage, setSubCategoryImage] = useState(null);
    const [editSubCategoryMode, setEditSubCategoryMode] = useState(false);
    const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        reset();
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('category');
            setCategories(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            const response = await axiosInstance.get(`category/${categoryId}/subcategory`);
            setSubcategories((prev) => ({
                ...prev,
                [categoryId]: response.data.data,
            }));
        } catch (error) {
            toast.error('Failed to fetch subcategories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (data) => {
        if (editMode) {
            await editCategory(data);
        } else {
            await addCategory(data);
        }
    };

    const addCategory = async (data) => {
        const formData = new FormData();
        formData.append('categoryName', data.categoryName);
        formData.append('category-image', data.categoryImage[0]);

        try {
            const response = await axiosInstance.post('category', formData);
            toast.success('Category added successfully!');
            fetchCategories();
            handleClose();
        } catch (error) {
            toast.error('Failed to add category');
        }
    };

    const editCategory = async (data) => {
        const formData = new FormData();
        formData.append('categoryName', data.categoryName);
        if (data.categoryImage[0]) {
            formData.append('categoryImage', data.categoryImage[0]);
        }

        try {
            const response = await axiosInstance.put(`category/${currentCategoryId}`, formData);
            toast.success('Category updated successfully!');
            fetchCategories();
            handleClose();
        } catch (error) {
            toast.error('Failed to update category');
        }
    };

    const handleEdit = (category) => {
        setEditMode(true);
        setCurrentCategoryId(category._id);
        setValue('categoryName', category.categoryName);
        handleOpen();
    };

    const deleteCategory = async (id) => {
        try {
            const response = await axiosInstance.delete(`category/${id}`);
            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const handleSubCategoryClick = (categoryId) => {
        if (subcategories[categoryId]) {
            setSubcategories((prev) => {
                const newState = {...prev};
                delete newState[categoryId];
                return newState;
            });
        } else {
            fetchSubCategories(categoryId);
        }
    };

    const addSubCategory = async (e) => {
        e.preventDefault();
        if (!selectedCategory || !subCategoryName || !subcategoryImage) {
            toast.error('Please select a category, provide a subcategory name, and upload an image.');
            return;
        }

        const formData = new FormData();
        formData.append('subcategoryName', subCategoryName);
        formData.append('subcategory-image', subcategoryImage);

        try {
            const response = await axiosInstance.post(`category/${selectedCategory}/subcategory`, formData);
            toast.success('Subcategory added successfully!');
            setSubCategoryName('');
            setSelectedCategory('');
            setSubCategoryImage(null);
            setSubCategoryOpen(false);
        } catch (error) {
            toast.error('Failed to add subcategory');
        }
    };

    const deleteSubCategory = async (subcategoryId, categoryId) => {
        try {
            const response = await axiosInstance.delete(`category/${categoryId}/subcategory/${subcategoryId}`);
            toast.success('Subcategory deleted successfully!');
            fetchSubCategories(categoryId);
        } catch (error) {
            toast.error('Failed to delete subcategory');
        }
    };

    const handleSubCategoryEdit = (subcategory, categoryId) => {
        setEditSubCategoryMode(true);
        setCurrentSubCategoryId(subcategory._id);
        setSubCategoryName(subcategory.subcategoryName);
        setSubCategoryImage(null);
        setSelectedCategory(categoryId);
        setSubCategoryOpen(true);
    };

    const editSubCategory = async (e) => {
        e.preventDefault();
        if (!selectedCategory || !subCategoryName) {
            toast.error('Please provide a subcategory name.');
            return;
        }

        const formData = new FormData();
        formData.append('subcategoryName', subCategoryName);
        if (subcategoryImage) {
            formData.append('subcategory-image', subcategoryImage);
        }

        try {
            const response = await axiosInstance.put(`category/${selectedCategory}/subcategory/${currentSubCategoryId}`, formData);
            toast.success('Subcategory updated successfully!');
            setSubCategoryName('');
            setSelectedCategory('');
            setSubCategoryImage(null);
            setEditSubCategoryMode(false);
            setSubCategoryOpen(false);
            fetchSubCategories(selectedCategory);
        } catch (error) {
            toast.error('Failed to update subcategory');
        }
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                {editMode ? 'Edit Category' : 'Add Category'}
            </Button>
            <Button
                variant="contained"
                color="secondary"
                style={{marginLeft: '10px'}}
                onClick={() => setSubCategoryOpen(true)}
            >
                Add Subcategory
            </Button>

            <TableContainer component={Paper} style={{marginTop: '20px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Category Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell>
                                    <img
                                        src={category.categoryImage}
                                        alt={category.categoryName}
                                        width="50"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(category)} color="primary">
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => deleteCategory(category._id)} color="secondary">
                                        <DeleteIcon/>
                                    </IconButton>

                                    <Button onClick={() => handleSubCategoryClick(category._id)} color="primary">
                                        {subcategories[category._id] ? 'Hide Subcategories' : 'Show Subcategories'}
                                    </Button>

                                    {subcategories[category._id] && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Subcategory Name</TableCell>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {subcategories[category._id].map((sub) => (
                                                    <TableRow key={sub._id}>
                                                        <TableCell>{sub.subcategoryName}</TableCell>
                                                        <TableCell>
                                                            <img
                                                                src={sub.subCategoryImage}
                                                                alt={sub.subcategoryName}
                                                                width="50"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton
                                                                onClick={() => handleSubCategoryEdit(sub, category._id)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => deleteSubCategory(sub._id, category._id)}
                                                                color="secondary">
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <h2>{editMode ? 'Edit Category' : 'Add Category'}</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            placeholder="Category Name"
                            {...register('categoryName', {required: true})}
                        />
                        {errors.categoryName && <span>This field is required</span>}
                        <br/>
                        <input
                            type="file"
                            {...register('categoryImage', {required: false})}
                        />
                        {errors.categoryImage && <span>This field is required</span>}
                        <br/>
                        <Button type="submit" variant="contained">
                            {editMode ? 'Update Category' : 'Add Category'}
                        </Button>
                    </form>
                </Box>
            </Modal>

            <Modal open={subCategoryOpen} onClose={() => setSubCategoryOpen(false)}>
                <Box sx={modalStyle}>
                    <h2>Edit Subcategory</h2>
                    <form onSubmit={editSubCategoryMode ? editSubCategory : addSubCategory}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                required
                                disabled={editSubCategoryMode}
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <br/>
                        <input
                            type="text"
                            placeholder="Subcategory Name"
                            value={subCategoryName}
                            onChange={(e) => setSubCategoryName(e.target.value)}
                            required
                        />
                        <br/>
                        <FormControl fullWidth style={{marginBottom: '10px'}}>
                            <input
                                type="file"
                                onChange={(e) => setSubCategoryImage(e.target.files[0])}  // Handle image file selection
                            />
                        </FormControl>
                        <br/>
                        <Button type="submit" variant="contained">
                            {editSubCategoryMode ? 'Update' : 'Add'} Subcategory
                        </Button>
                    </form>
                </Box>
            </Modal>

            <ToastContainer/>
        </>
    );
}

export default Category;
