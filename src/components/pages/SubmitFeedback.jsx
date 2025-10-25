"use client"

import { useState } from "react"
import {
    Box,
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Paper,
    Alert,
    Snackbar,
    IconButton,
    Chip,
    Card,
    CardContent,
    Stack,
    Divider
} from '@mui/material'
import {
    Send as SendIcon,
    ContentCopy as CopyIcon,
    Feedback as FeedbackIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import toast from "react-hot-toast"
import TrackFeedbackModal from "../modals/TrackFeedbackModal"

export default function SubmitFeedback() {
    const [formData, setFormData] = useState({
        category: "",
        description: "",
        location: "",
        email: "",
    })
    const userName = sessionStorage.getItem("name") || ""
    const email = sessionStorage.getItem("email") || ""
    const userId = parseInt(sessionStorage.getItem("userId") || "0", 10);
    const apikey = process.env.REACT_APP_FEEDBACK_API_KEY
    const apiUrl = process.env.REACT_APP_REPORT_URL

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [trackId, setTrackId] = useState("")
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
    const [openModal, setOpenModal] = useState(false)

    const categories = ["Complaint", "Suggestion"]

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity })
    }

    const handleSubmit = async (e) => {
        await handleExternal()
    }



    const handleExternal = async () => {
        setIsSubmitting(true)
        const payload = {
            type: formData.category,
            message: formData.description,
            location: formData.location,
            contactEmail: email,
            externalUserId: userId,
            externalUserName: userName,
        }

        try {
            const res = await fetch(`${apiUrl}/api/customerengagement/external`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                    'X-Api-Key': apikey,
                },
                body: JSON.stringify(payload),
            })

            const response = await res.json()

            if (res.ok && response?.isSuccess && response?.data?.citizenFeedbackTrackId) {
                toast.success("Feedback submitted successfully!")
                setTrackId(response.data.citizenFeedbackTrackId)
                setFormData({
                    category: "",
                    description: "",
                    location: "",
                    email: "",
                })
            } else {
                throw new Error("Unexpected response")
            }
        } catch (error) {
            console.error("Submission error:", error)
            showSnackbar("Something went wrong. Please try again.", "error")
        }

        setIsSubmitting(false)
    }

    const handleCopy = async () => {
        if (trackId) {
            await navigator.clipboard.writeText(trackId)
            showSnackbar("Tracking ID copied to clipboard", "success")
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent={"space-between"} spacing={1} sx={{ mb: 2 }}>

                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <FeedbackIcon color="primary" fontSize="large" />
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            Submit Feedback
                        </Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary">
                        Help us improve by reporting issues or sharing feedback.
                    </Typography>
                </Box>

                <Button variant="outlined" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
                    Track Feedback
                </Button>
            </Stack>

            {trackId && (
                <Card sx={{ mb: 3, bgcolor: 'warning.50', borderColor: 'warning.main', borderWidth: 1, borderStyle: 'solid' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <CheckCircleIcon color="warning" />
                            <Typography variant="h6" color="warning.dark" fontWeight="semibold">
                                Feedback Submitted
                            </Typography>
                        </Stack>

                        <Typography variant="body2" color="warning.dark" sx={{ mb: 1 }}>
                            Your tracking ID is:
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Chip
                                label={trackId}
                                sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 'medium',
                                    bgcolor: 'warning.100',
                                    color: 'text.primary'
                                }}
                            />
                            <IconButton
                                onClick={handleCopy}
                                size="small"
                                sx={{ color: 'warning.dark' }}
                            >
                                <CopyIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Alert severity="warning" sx={{ bgcolor: 'transparent', pl: 0 }}>
                            Please copy and save this ID. You may need it to track or follow up on your feedback.
                        </Alert>
                    </CardContent>
                </Card>
            )}

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box>
                    <Stack spacing={3}>
                        <FormControl fullWidth required>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            name="description"
                            label="Description"
                            required
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your feedback or issue in detail"
                            variant="outlined"
                            fullWidth
                        />

                        <TextField
                            name="location"
                            label="Location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Sector 12, Main Street"
                            variant="outlined"
                            fullWidth
                        />

                        {/* <TextField
                            name="email"
                            type="email"
                            label="Email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            variant="outlined"
                            fullWidth
                        /> */}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                startIcon={<SendIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'medium'
                                }}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Feedback"}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>

            {
                openModal && (
                    <TrackFeedbackModal
                        open={openModal}
                        closeModal={() => setOpenModal(false)}
                        trackId={trackId}
                    />
                )
            }

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}