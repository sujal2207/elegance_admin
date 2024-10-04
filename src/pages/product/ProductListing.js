import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Typography
} from '@mui/material';
import axiosInstance from "../auth/axiosInstance";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('product');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (productId) => {
        navigate(`/add-product/${productId}`);
    };

    const handleDelete = async (productId) => {
        try {
            await axiosInstance.delete(`product/${productId}`);
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleAddProduct = () => {
        navigate('/add-product');
    };

    return (
        <Paper sx={{padding: 2}}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{fontSize: '26px', fontWeight: '600', mb: '40px'}}
            >
                Product Listings
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
                sx={{marginBottom: '20px'}}
            >
                Add Product
            </Button>
            {products.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: '600', fontSize: '17px'}}>
                                    Thumbnail
                                </TableCell>
                                <TableCell sx={{fontWeight: '600', fontSize: '17px'}}>
                                    Title
                                </TableCell>
                                <TableCell sx={{fontWeight: '600', fontSize: '17px'}}>
                                    Category
                                </TableCell>
                                <TableCell sx={{fontWeight: '600', fontSize: '17px'}}>
                                    Sub Category
                                </TableCell>
                                <TableCell sx={{fontWeight: '600', fontSize: '17px'}}>
                                    Price
                                </TableCell>
                                <TableCell sx={{fontWeight: '600', fontSize: '17px'}}>
                                    Sale Price
                                </TableCell>
                                <TableCell sx={{fontWeight: '600', fontSize: '17px'}}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products?.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            style={{width: '50px', height: '50px'}}
                                        />
                                    </TableCell>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>{product?.pCate?.categoryName}</TableCell>
                                    <TableCell>{product.cate?.subcategoryName}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.salePrice}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(product._id)}
                                            style={{marginRight: '10px'}}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6">No products available.</Typography>
            )}
        </Paper>
    );
};

export default ProductList;
