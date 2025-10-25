"use client"

import React, { useState } from "react"
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Alert,
    AlertTitle,
    Chip,
    Grid,
    Paper,
    CircularProgress,
    Container,
    Stack,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton
} from "@mui/material"
import {
    Search as SearchIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Close as CloseIcon
} from "@mui/icons-material"
import toast from "react-hot-toast"

export default function TrackFeedbackModal({ open, closeModal }) {
    const [trackingId, setTrackingId] = useState("")
    const [feedback, setFeedback] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const apikey = process.env.REACT_APP_FEEDBACK_API_KEY
    const apiUrl = process.env.REACT_APP_REPORT_URL

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!trackingId.trim()) {
            setError("Please enter a tracking ID")
            return
        }

        setLoading(true)
        setError("")
        setFeedback(null)

        try {
            const res = await fetch(`${apiUrl}/api/customerengagement/track-id${trackingId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                    'X-Api-Key': apikey,
                },
            })

            const response = await res.json()
            const result = await response

            if (result.isSuccess && result.data) {
                setFeedback(result.data)
            } else {
                setError("Feedback not found. Please check your tracking ID and try again.")
                toast.error("Feedback not found. Please check your tracking ID and try again.")
            }
        } catch (err) {
            setError("An error occurred. Please try again later.")
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <ScheduleIcon sx={{ fontSize: 16 }} />
            case "in-progress":
                return <WarningIcon sx={{ fontSize: 16 }} />
            case "resolved":
                return <CheckCircleIcon sx={{ fontSize: 16 }} />
            default:
                return <ScheduleIcon sx={{ fontSize: 16 }} />
        }
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "warning"
            case "in-progress":
                return "info"
            case "resolved":
                return "success"
            default:
                return "default"
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleClose = () => {
        // Reset form state when closing
        setTrackingId("")
        setFeedback(null)
        setError("")
        setLoading(false)
        closeModal()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" component="h1" fontWeight="bold">
                            Track Feedback
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your tracking ID to check the status of your feedback
                        </Typography>
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* Search Form */}
                    <Card elevation={1}>
                        <CardContent>
                            <Box component="form" onSubmit={handleSearch}>
                                <Grid container spacing={2} alignItems="end">
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            fullWidth
                                            label="Tracking ID"
                                            placeholder="e.g., TCK202506110911233NHC0QZPG"
                                            value={trackingId}
                                            onChange={(e) => setTrackingId(e.target.value)}
                                            variant="outlined"
                                            size="medium"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={loading}
                                            startIcon={
                                                loading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    <SearchIcon />
                                                )
                                            }
                                            sx={{
                                                py: 1.5,
                                                textTransform: "none",
                                                fontWeight: 600
                                            }}
                                        >
                                            {loading ? "Searching..." : "Track"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Error Display */}
                            {error && (
                                <Box sx={{ mt: 3 }}>
                                    <Alert severity="error" icon={<ErrorIcon />}>
                                        <AlertTitle>Error</AlertTitle>
                                        {error}
                                    </Alert>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Feedback Results */}
                    {feedback && (
                        <Card elevation={1}>
                            <CardContent>
                                <Stack spacing={3}>
                                    {/* Header */}
                                    <Box>
                                        <Typography variant="h6" component="h2" fontWeight="semibold" gutterBottom>
                                            Feedback Details
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tracking ID: {feedback.trackingId}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    {/* Details Grid */}
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Type
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {feedback.type}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Status
                                                </Typography>
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Chip
                                                        icon={getStatusIcon(feedback.status)}
                                                        label={feedback.status}
                                                        color={getStatusColor(feedback.status)}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            textTransform: "capitalize",
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Location
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {feedback.location}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Contact Email
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {feedback.contactEmail}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Created At
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formatDate(feedback.createdAt)}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {feedback.actionTaken && (
                                            <Grid item xs={12}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        Action Taken
                                                    </Typography>
                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            mt: 1,
                                                            backgroundColor: "grey.50"
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            {feedback.actionTaken}
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            </Grid>
                                        )}

                                        {feedback.resolutionNotes && (
                                            <Grid item xs={12}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        Resolution Notes
                                                    </Typography>
                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            mt: 1,
                                                            backgroundColor: "grey.50"
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            {feedback.resolutionNotes}
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    )
}