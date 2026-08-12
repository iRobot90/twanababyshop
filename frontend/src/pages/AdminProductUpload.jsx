import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CloudUploadOutlined, ImageOutlined } from '@mui/icons-material';
import AdminAccessGate from '../components/AdminAccessGate';

export default function AdminProductUpload() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('clothing');
  const [imagePreview, setImagePreview] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const finalPrice = useMemo(() => {
    const base = Number(price) || 0;
    const percent = Number(discount) || 0;
    if (!base) return 0;
    return Math.max(0, base - (base * percent) / 100);
  }, [price, discount]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!name || !price || !description) {
      setSavedMessage('Please complete the required fields.');
      return;
    }

    const productPayload = {
      name,
      price: Number(price),
      discount: Number(discount || 0),
      finalPrice,
      category,
      description,
      image: imagePreview || '/images/category-placeholder.jpg',
    };

    localStorage.setItem('twana_last_product', JSON.stringify(productPayload));
    setSavedMessage('Product saved locally. You can review it from the admin dashboard.');
  };

  return (
    <AdminAccessGate title="Twana Admin" subtitle="Upload and manage products for the storefront.">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
        <Card sx={{ borderRadius: 4, boxShadow: '0 20px 45px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', px: 4, py: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Add New Product
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5 }}>
              Create a premium storefront experience with images, pricing, and discounts.
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <form onSubmit={handleSave}>
              {savedMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {savedMessage}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Stack spacing={2.5}>
                    <TextField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} fullWidth required />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth required />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField label="Discount (%)" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} fullWidth inputProps={{ min: 0, max: 100 }} />
                      </Grid>
                    </Grid>

                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                        <MenuItem value="clothing">Clothing</MenuItem>
                        <MenuItem value="toys">Toys</MenuItem>
                        <MenuItem value="nursery">Nursery</MenuItem>
                        <MenuItem value="feeding">Feeding</MenuItem>
                        <MenuItem value="bath-care">Bath & Care</MenuItem>
                      </Select>
                    </FormControl>

                    <Button component="label" variant="outlined" startIcon={<CloudUploadOutlined />} sx={{ alignSelf: 'flex-start' }}>
                      Upload Image
                      <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    </Button>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`Base Price: $${Number(price || 0).toFixed(2)}`} color="primary" variant="outlined" />
                      <Chip label={`Discount: ${discount || 0}%`} color="secondary" variant="outlined" />
                      <Chip label={`Final Price: $${finalPrice.toFixed(2)}`} color="success" variant="filled" />
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                        Product Preview
                      </Typography>
                      <Box sx={{ border: '1px dashed #d0d7de', borderRadius: 3, minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', background: imagePreview ? `url(${imagePreview}) center/cover no-repeat` : '#f8fafc' }}>
                        {!imagePreview && <Stack alignItems="center" spacing={1} color="text.secondary"><ImageOutlined sx={{ fontSize: 40 }} /><Typography>Your image will appear here</Typography></Stack>}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        The preview uses the same image area styling as the storefront product cards so it fits naturally.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" size="large">
                  Save Product
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </AdminAccessGate>
  );
}
