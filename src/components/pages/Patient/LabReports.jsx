import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Paper,
  Modal,
  TableContainer,
  Grid,
  IconButton,
  Divider,
  Button, // Import Button for the download functionality
} from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close'; // Import a proper close icon
// import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'; // Icon for print button
import { MdPrint, MdClose } from "react-icons/md";

import { styled } from "@mui/material/styles"; // Import styled for custom components
// import { get } from "../../utility/fetch";
// import { get } from "../../../utility/fetch2";
// import { get } from "services/fetch";

// import { calculateAge } from "../../utility/general";

// Import jsPDF and html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Styled components for visual consistency (from previous beautiful version)
const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 1000,
  backgroundColor: "#f8fbf9", // Overall very light green background
  boxShadow: theme.shadows[24], // Stronger shadow for the modal
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2, // More rounded corners
  fontFamily: "Arial, sans-serif", // Ensure font consistency
  maxHeight: "95vh", // Limit modal height
  overflowY: "auto", // Enable scrolling within modal if content overflows
}));

const ReportContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3), // Padding for the printable content
  backgroundColor: "#ffffff", // White background for the report content itself
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #e0e0e0", // Subtle border
}));

const ReportHeaderTypography = styled(Typography)(({ theme }) => ({
  color: "#2e7d32", // Darker green for main heading
  fontWeight: "bold",
  fontFamily: "'Roboto Condensed', sans-serif",
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

const SubHeaderTypography = styled(Typography)(({ theme }) => ({
  color: "#2e7d32",
  fontWeight: "bold",
  fontFamily: "'Roboto Condensed', sans-serif",
  fontSize: "1.25rem", // Slightly larger for sub-headers
}));

const SectionTitleTypography = styled(Typography)(({ theme }) => ({
  color: "#2e7d32",
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const InfoTextTypography = styled(Typography)(({ theme }) => ({
  color: "#555",
  "& strong": {
    color: "#2e7d32",
  },
}));

const VitalSignsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: "#e8f5e9", // Lighter green for vital signs background
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2], // Subtle shadow for paper
}));

const VitalItemBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#f1f8e9",
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#2e7d32", // Dark green for table headers
  color: "white",
  fontWeight: "bold",
  fontSize: "0.95rem",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f8fbf9", // Very light green for odd rows
  },
  "&:hover": {
    backgroundColor: "#e8f5e9", // Slightly darker green on hover
  },
  "&:last-child td": {
    borderBottom: 0,
  },
}));

const ResultTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: "#2e7d32",
}));

const FlagTableCell = styled(TableCell)(({ theme, isflagged }) => ({
  fontWeight: "bold",
  color: isflagged ? theme.palette.error.main : "#2e7d32", // Red for flagged, dark green for normal
}));

// Helper function for reference range content
const getRefRangeContent = (details) => {
  const {
    normalRefRange,
    refRange_Male,
    refRange_FeMale,
    refRange_Elderly,
    refRange_Adult,
    refRange_Children,
  } = details;

  const hasGenderRanges =
    refRange_Male &&
    refRange_FeMale &&
    refRange_Elderly &&
    (refRange_Male !== normalRefRange ||
      refRange_FeMale !== normalRefRange ||
      refRange_Elderly !== normalRefRange);
  const hasAgeRanges =
    refRange_Adult &&
    refRange_Children &&
    (refRange_Adult !== normalRefRange || refRange_Children !== normalRefRange);

  if (hasGenderRanges) {
    return (
      <Table size="small" sx={{ mb: 1, minWidth: "250px" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#3C7E2D" }}>
            <TableCell
              align="center"
              sx={{ color: "white", fontWeight: "bold", py: 1 }}
            >
              MALE
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", fontWeight: "bold", py: 1 }}
            >
              FEMALE
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", fontWeight: "bold", py: 1 }}
            >
              ELDERLY
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" sx={{ py: 1 }}>
              {refRange_Male || "-"}
            </TableCell>
            <TableCell align="center" sx={{ py: 1 }}>
              {refRange_FeMale || "-"}
            </TableCell>
            <TableCell align="center" sx={{ py: 1 }}>
              {refRange_Elderly || "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (hasAgeRanges) {
    return (
      <Table size="small" sx={{ mb: 1, minWidth: "200px" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#3C7E2D" }}>
            <TableCell
              align="center"
              sx={{ color: "white", fontWeight: "bold", py: 1 }}
            >
              ADULT
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: "white", fontWeight: "bold", py: 1 }}
            >
              CHILDREN
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" sx={{ py: 1 }}>
              {refRange_Adult || "-"}
            </TableCell>
            <TableCell align="center" sx={{ py: 1 }}>
              {refRange_Children || "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Typography variant="body2" sx={{ color: "#555" }}>
      {normalRefRange || "-"}
    </Typography>
  );
};

// Robust flag checking logic (from previous version)
const checkRangeAndGetFlag = (resultStr, testDetails, selectedRangeType) => {
  const result = parseFloat(resultStr);
  if (isNaN(result)) {
    return "";
  }

  let refRangeStr = testDetails[selectedRangeType];
  if (!refRangeStr || refRangeStr.trim() === "") {
    refRangeStr = testDetails.normalRefRange;
  }

  if (!refRangeStr || refRangeStr.trim() === "" || refRangeStr === "-") {
    return "";
  }

  const cleanedRange = refRangeStr
    ?.toLowerCase()
    ?.replace(/mm\/hr|%|x ?10\^3\/ul|g\/dl|fl|pg|mg\/dl/g, "")
    ?.trim();

  let lowerBound = -Infinity;
  let upperBound = Infinity;

  if (cleanedRange.includes("-")) {
    const parts = cleanedRange.split("-").map((s) => parseFloat(s.trim()));
    lowerBound = isNaN(parts[0]) ? -Infinity : parts[0];
    upperBound = isNaN(parts[1]) ? Infinity : parts[1];
  } else if (cleanedRange.startsWith("<=")) {
    upperBound = parseFloat(cleanedRange.substring(2).trim());
  } else if (cleanedRange.startsWith("<")) {
    upperBound = parseFloat(cleanedRange.substring(1).trim()) - Number.EPSILON;
  } else if (cleanedRange.startsWith(">=")) {
    lowerBound = parseFloat(cleanedRange.substring(2).trim());
  } else if (cleanedRange.startsWith(">")) {
    lowerBound = parseFloat(cleanedRange.substring(1).trim()) + Number.EPSILON;
  } else {
    const singleValue = parseFloat(cleanedRange);
    if (!isNaN(singleValue)) {
      lowerBound = singleValue;
      upperBound = singleValue;
    } else {
      return "";
    }
  }

  if (result < lowerBound) {
    return "LOW";
  } else if (result > upperBound) {
    return "HIGH";
  } else {
    return "NORMAL";
  }
};

const LabReportTable = ({ patientInfo, open, onClose, labreports }) => {
  const [patientTestReports, setPatientTestReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vitalInfo, setVitalInfo] = useState();

  // Ref for the content you want to print (only the report content, not modal chrome)
  const reportContentRef = useRef();

  // Function to handle PDF download
  const handleDownloadPdf = async () => {
    const input = reportContentRef.current;
    if (!input) {
      console.error("Report content ref is not available.");
      return;
    }

    // Set a higher scale for better quality PDF
    // You might need to experiment with scale and DPI for optimal results
    const canvas = await html2canvas(input, {
      scale: 3, // Increase scale for higher resolution
      useCORS: true, // If images are from different origins
      logging: false, // Disable logging for cleaner console
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'mm' for millimeters, 'a4' for A4 size

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if content is taller than one A4 page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `Lab_Report_${patientInfo?.patient?.firstName}_${
      patientInfo?.patient?.lastName
    }_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
    pdf.save(fileName);
  };

  // const getLabResults = async () => {
  //   try {
  //     setLoading(true);
  //     // const res = await get(
  //     //   `/patientinternallabreport/internal-lab-report/lab-request/${patientInfo?.id}`
  //     // );
  //     let res = await get({
  //       // endpoint: `patientlabreport/patient-report/${patientId?.id}/labtechnician/${userAuth?.resultList?.userId}`,
  //       endpoint: `patientinternallabreport/internal-lab-report/lab-request/${187}`,
  //       // body: formData,
  //       // auth: false,
  //     });
  //     console.log(res);
  //     setPatientTestReports(res?.data.patientTestReports || []);
  //     setVitalInfo(res?.data[0]?.vital || {});
  //   } catch (e) {
  //     console.error(e);
  //     setPatientTestReports([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // console.log(patientInfo);

    if (open) {
      // getLabResults();
      setPatientTestReports(labreports?.patientTestReports);
      console.log(labreports?.patientTestReports);
      console.log(labreports);
      console.log(patientInfo);
    }
  }, [open, patientInfo?.id, labreports.id]); // Depend on patientInfo.id as well

  // Dummy patient info if not provided for testing
  const displayPatientInfo = patientInfo || {
    patientFullName: "N/A",
    id: "N/A",
    patient: {},
    testRequests: [{ internalLabService: {} }],
  };
  const displayVitalInfo = vitalInfo || null;

  return (
    <Modal open={true} onClose={onClose}>
      <StyledModalBox>
        {/* Header with Organization Name, Test Name, and Close/Print Buttons */}
        <ReportHeaderTypography variant="h5" sx={{ mb: 1 }}>
          {sessionStorage?.getItem("healthCareProviderName") ||
            "Healthcare Provider"}
        </ReportHeaderTypography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <SubHeaderTypography variant="h6">
            🧪{" "}
            {displayPatientInfo?.testRequests?.[0]?.internalLabService?.name ||
              "Lab Report"}
          </SubHeaderTypography>
          <Box>
            <IconButton
              onClick={handleDownloadPdf}
              color="primary"
              sx={{ color: "#2e7d32" }}
            >
              <MdPrint />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: "#2e7d32" }}>
              <MdClose />
            </IconButton>
          </Box>
        </Box>
        <ReportContentBox ref={reportContentRef}>
          {" "}
          {/* This is the printable content area */}
          {/* Patient Information */}
          <Paper
            sx={{
              padding: 3,
              mb: 3,
              backgroundColor: "#ffffff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)", // Lighter shadow for inner paper
            }}
          >
            <SectionTitleTypography variant="subtitle1">
              <strong>Patient Information</strong>
            </SectionTitleTypography>
            <Divider sx={{ mb: 1 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoTextTypography>
                  <strong>Name:</strong> {displayPatientInfo?.patientFullName}
                </InfoTextTypography>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <InfoTextTypography><strong>Age:</strong> {calculateAge(displayPatientInfo?.patient?.dateOfBirth) || 'N/A'}</InfoTextTypography>
              </Grid> */}
              <Grid item xs={12} md={6}>
                <InfoTextTypography>
                  <strong>Date:</strong>{" "}
                  {
                    displayPatientInfo?.labRequestDate
                  }
                </InfoTextTypography>
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoTextTypography>
                  <strong>Test Required:</strong>{" "}
                  {displayPatientInfo?.testRequests?.[0]?.internalLabService
                    ?.name || "N/A"}
                </InfoTextTypography>
              </Grid>
            </Grid>
          </Paper>
          {/* Vital Signs Section */}
          {displayVitalInfo && (
            <VitalSignsPaper elevation={2}>
              <SectionTitleTypography variant="h6">
                <span>🩺</span> Vital Signs
              </SectionTitleTypography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[
                  {
                    label: "Date",
                    value: new Date(
                      displayVitalInfo.dateOfVisit
                    ).toLocaleDateString(),
                  },
                  {
                    label: "Temperature",
                    value: `${displayVitalInfo.temperature} °C`,
                  },
                  {
                    label: "Blood Pressure",
                    value: `${displayVitalInfo.bloodPressure} mmHg`,
                  },
                  {
                    label: "Heart Pulse",
                    value: `${displayVitalInfo.heartPulse} bpm`,
                  },
                  {
                    label: "Respiratory Rate",
                    value: `${displayVitalInfo.respiratory} bpm`,
                  },
                  {
                    label: "Oxygen Saturation",
                    value: `${displayVitalInfo.oxygenSaturation} %`,
                  },
                  {
                    label: "Blood Sugar",
                    value: `${displayVitalInfo.bloodSugar} mg/dL`,
                  },
                  { label: "Height", value: `${displayVitalInfo.height} cm` },
                  { label: "Weight", value: `${displayVitalInfo.weight} kg` },
                  { label: "BMI", value: displayVitalInfo.bmi },
                ].map((item, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <VitalItemBox>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#555", fontWeight: "bold" }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "#2e7d32", fontWeight: "medium" }}
                      >
                        {item.value}
                      </Typography>
                    </VitalItemBox>
                  </Grid>
                ))}
              </Grid>
            </VitalSignsPaper>
          )}
          {/* Lab Results Table */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              mb: 3, // Margin bottom for comments section
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#2e7d32" }}>
                    <TableHeaderCell>PARAMETER</TableHeaderCell>
                    <TableHeaderCell>RESULT</TableHeaderCell>
                    <TableHeaderCell>UNIT</TableHeaderCell>
                    <TableHeaderCell>REFERENCE RANGE</TableHeaderCell>
                    {/* <TableHeaderCell>FLAG</TableHeaderCell>  */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <StyledTableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" sx={{ color: "#555" }}>
                          Loading lab results...
                        </Typography>
                      </TableCell>
                    </StyledTableRow>
                  ) : patientTestReports?.length > 0 ? (
                    patientTestReports.flatMap((report) =>
                      report?.labTestServiceResults?.map((item, index) => {
                        const { result, testDetails } = item;
                        const refRangeContent = getRefRangeContent(testDetails);
                        const flag = checkRangeAndGetFlag(
                          result,
                          testDetails,
                          "normalRefRange"
                        ); // You can make this dynamic if needed

                        return (
                          <StyledTableRow
                            key={testDetails.id || `row-${index}`}
                          >
                            <TableCell sx={{ fontWeight: "medium" }}>
                              {testDetails.parameter}
                            </TableCell>
                            <ResultTableCell>{result}</ResultTableCell>
                            <TableCell>
                              {testDetails.unitOfMeasurement || "-"}
                            </TableCell>
                            <TableCell sx={{ minWidth: 200 }}>
                              {refRangeContent}
                            </TableCell>
                            {/* <FlagTableCell isflagged={flag === 'HIGH' || flag === 'LOW'}>
                              {flag === 'HIGH' ? "⬆️ HIGH" : flag === 'LOW' ? "⬇️ LOW" : "✅ NORMAL"}
                            </FlagTableCell> */}
                          </StyledTableRow>
                        );
                      })
                    )
                  ) : (
                    <StyledTableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" sx={{ color: "#555" }}>
                          No lab results available.
                        </Typography>
                      </TableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/* Comments Section */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              border: "1px solid #e0e0e0", // Subtle border
              mb: 3, // Margin bottom for signature section
            }}
          >
            <SectionTitleTypography variant="subtitle1">
              <strong>Comments:</strong>
            </SectionTitleTypography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2" sx={{ color: "#555" }}>
              {patientInfo?.comments || "No additional comments provided."}
            </Typography>
          </Box>
          {/* Footer / Signature Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 2,
              borderTop: "1px dashed #a5d6a7", // Dashed green line
            }}
          >
            <Typography variant="caption" sx={{ color: "#757575" }}>
              Generated on{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="caption" sx={{ color: "#757575" }}>
              ConnectHealthPro v1.0
            </Typography>
          </Box>
        </ReportContentBox>{" "}
        {/* End of printable content area */}
      </StyledModalBox>
    </Modal>
  );
};

export default LabReportTable;
