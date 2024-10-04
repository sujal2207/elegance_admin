import React, { useState, useEffect } from 'react';
import axiosInstance from "../auth/axiosInstance";

function Offer() {
    const [offerImages, setOfferImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [existingImages, setExistingImages] = useState([]);

    const fetchExistingImages = async () => {
        try {
            const response = await axiosInstance.get('offer');
            const images = response.data.data.map(item => ({
                _id: item._id,
                url: item.offer_images,
            }));

            setExistingImages(images);
        } catch (error) {
            console.error('Error fetching existing images:', error);
        }
    };

    useEffect(() => {
        fetchExistingImages();

        return () => {
            previewImages.forEach((src) => URL.revokeObjectURL(src));
        };
    }, [previewImages]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const validFiles = files.filter(file => file.type.startsWith('image/'));
        setOfferImages(validFiles);

        const previews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (offerImages.length === 0) {
            alert('Please select at least one image.');
            return;
        }

        const formData = new FormData();
        offerImages.forEach((file) => {
            formData.append('offer_images', file);
        });

        try {
            const response = await axiosInstance.post('offer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Offer submitted successfully', response.data);
            setOfferImages([]);
            setPreviewImages([]);
            setIsModalOpen(false);
            fetchExistingImages();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setOfferImages([]);
        setPreviewImages([]);
    };

    const handleDelete = async (imageId) => {
        try {
            const response = await axiosInstance.delete(`offer/${imageId}`);
            setExistingImages((prevImages) => prevImages.filter((img) => img._id !== imageId));
            console.log('Image deleted successfully', response.data);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <div className="offer-form-container" style={styles.container}>
            <h2 style={styles.heading}>Manage Offer</h2>
            <button onClick={() => setIsModalOpen(true)} style={styles.openModalButton}>Add Offer Image</button>

            <div style={styles.existingImagesContainer}>
                {existingImages?.map((image) => (
                    <div key={image._id} style={styles.existingImageWrapper}>
                        <img src={image.url} alt="Offer" style={styles.existingImage} />
                        <div style={styles.imageActions}>
                            <button onClick={() => handleDelete(image._id)} style={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Upload Offer Images</h3>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.field}>
                                <label style={styles.label}>Offer Images:</label>
                                <input
                                    type="file"
                                    name="offer-images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.previewContainer}>
                                {previewImages?.map((src, index) => (
                                    <img key={index} src={src} alt={`Offer Preview ${index + 1}`} style={styles?.previewImage} />
                                ))}
                            </div>

                            <div style={styles.modalActions}>
                                <button type="submit" style={styles.button}>Submit</button>
                                <button type="button" onClick={closeModal} style={styles.closeButton}>
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    openModalButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '15px',
    },
    existingImagesContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '20px',
        width: '100%',
    },
    existingImageWrapper: {
        position: 'relative',
    },
    existingImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    imageActions: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '5px',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '500px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    field: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    previewContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '10px',
        marginTop: '15px',
    },
    previewImage: {
        width: '100%',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    closeButton: {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Offer;
