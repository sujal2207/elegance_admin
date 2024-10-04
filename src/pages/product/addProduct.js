import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
    Button,
    TextField,
    Typography,
    InputLabel,
    Input,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Box,
    Paper,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from "../auth/axiosInstance";

function AddProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            title: '',
            thumbnail: '',
            price: '',
            salePrice: '',
            category: '',
            categoryName: '',
            gallery: [],
            shortDesText: '',
            shortDesListItem: '',
            description: [{ title: '', text: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "description",
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const selectedCategory = watch('category');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('category');
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories.');
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchSubcategories = async () => {
                try {
                    const response = await axiosInstance.get(`category/${selectedCategory}/subcategory`);
                    setSubcategories(response.data.data);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                    toast.error('Failed to load subcategories.');
                }
            };

            fetchSubcategories();
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axiosInstance.get(`product/${id}`);
                    const product = response.data;

                    setValue('title', product.title);
                    setValue('price', product.price);
                    setValue('salePrice', product.salePrice);
                    setValue('category', product.pCate._id);
                    setValue('categoryName', product.cate ? product.cate._id : '');
                    setValue('shortDesText', product.shortDes.shortDesText);
                    setValue('shortDesListItem', product.shortDes.shortDesListItem);
                    setValue('description', product.description || [{ title: '', text: '' }]);
                    setThumbnailPreview(product.thumbnail);
                    setGalleryPreviews(product.gallery);
                } catch (error) {
                    console.error('Error fetching product:', error);
                    toast.error('Failed to load product data.');
                }
            };

            fetchProduct();
        }
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);

            if (data.thumbnail && data.thumbnail.length > 0) {
                formData.append('thumbnail', data.thumbnail[0]);
            }

            formData.append('price', data.price);
            formData.append('salePrice', data.salePrice);
            formData.append('pCate', data.category);
            formData.append('cate', data.categoryName);

            const shortDes = {
                shortDesText: data.shortDesText,
                shortDesListItem: data.shortDesListItem,
            };

            formData.append('shortDes', JSON.stringify(shortDes));
            formData.append('description', JSON.stringify(data.description));

            data.gallery.forEach((file) => {
                formData.append('gallery', file);
            });

            const response = id
                ? await axiosInstance.put(`product/${id}`, formData)
                : await axiosInstance.post('product', formData);

            toast.success(id ? 'Product updated successfully!' : 'Product added successfully!');
            reset();
            setThumbnailPreview(null);
            setGalleryPreviews([]);
            navigate('/');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product. Please try again.');
        }
    };

    const handleReset = () => {
        reset();
        setThumbnailPreview(null);
        setGalleryPreviews([]);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('thumbnail', e.target.files);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert('You can upload a maximum of 5 images.');
            return;
        }
        setValue('gallery', files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setGalleryPreviews(previews);
    };

    const addDescriptionField = () => {
        append({ title: '', text: '' });
    };

    const removeDescriptionField = (index) => {
        remove(index);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <ToastContainer />
            <Typography variant="h4" gutterBottom>
                {id ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    {/* Title */}
                    <Grid item xs={12}>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Product Title" fullWidth required />
                            )}
                        />
                    </Grid>

                    {/* Thumbnail */}
                    <Grid item xs={12}>
                        <InputLabel>Product Thumbnail</InputLabel>
                        <Input
                            type="file"
                            onChange={handleImageUpload}
                            inputProps={{ accept: 'image/*' }}
                            fullWidth
                        />
                        {thumbnailPreview && (
                            <img src={thumbnailPreview} alt="Thumbnail Preview" width="100" />
                        )}
                    </Grid>

                    {/* Price */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Price" type="number" fullWidth required />
                            )}
                        />
                    </Grid>

                    {/* Sale Price */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="salePrice"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Sale Price" type="number" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} displayEmpty>
                                        <MenuItem value="" disabled>Select Category</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category._id} value={category._id}>
                                                {category.categoryName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    {/* Subcategory */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Subcategory</InputLabel>
                            <Controller
                                name="categoryName"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} displayEmpty>
                                        <MenuItem value="" disabled>Select Subcategory</MenuItem>
                                        {subcategories.map((subcategory) => (
                                            <MenuItem key={subcategory._id} value={subcategory._id}>
                                                {subcategory.subcategoryName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    </Grid>

                    {/* Dynamic Description Fields */}
                    {fields.map((item, index) => (
                        <Grid container spacing={2} key={item.id}>
                            <Grid item xs={12} sm={5}>
                                <Controller
                                    name={`description[${index}].title`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label={`Description Title ${index + 1}`} fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Controller
                                    name={`description[${index}].text`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label={`Description Text ${index + 1}`} fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => removeDescriptionField(index)}
                                >
                                    Remove
                                </Button>
                            </Grid>
                        </Grid>
                    ))}

                    {/* Add new description field */}
                    <Grid item xs={12}>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={addDescriptionField}
                        >
                            Add Description Field
                        </Button>
                    </Grid>

                    {/* Short Description Text */}
                    <Grid item xs={12}>
                        <Controller
                            name="shortDesText"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Short Description Text" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* Short Description List Item */}
                    <Grid item xs={12}>
                        <Controller
                            name="shortDesListItem"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Short Description List Item" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* Gallery */}
                    <Grid item xs={12}>
                        <InputLabel>Gallery</InputLabel>
                        <Input
                            type="file"
                            onChange={handleGalleryUpload}
                            inputProps={{ accept: 'image/*', multiple: true }}
                            fullWidth
                        />
                        <Box>
                            {galleryPreviews.map((preview, index) => (
                                <img key={index} src={preview} alt="Gallery Preview" width="100" />
                            ))}
                        </Box>
                    </Grid>

                    {/* Form Actions */}
                    <Grid item xs={12} style={{ textAlign: 'right' }}>
                        <Button variant="contained" color="primary" type="submit">
                            {id ? 'Update Product' : 'Add Product'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            type="button"
                            onClick={handleReset}
                            style={{ marginLeft: '10px' }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="text"
                            color="default"
                            type="button"
                            onClick={handleBack}
                            style={{ marginLeft: '10px' }}
                        >
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

export default AddProduct;
