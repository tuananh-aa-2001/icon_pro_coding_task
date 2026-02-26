import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  LinearProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { Ticket } from '../types/ticket'
import { 
  ImportPreview, 
  ImportOptions
} from '../types/importExport'
import { importFromFile, detectFileFormat } from '../utils/importUtils'
import FileUpload from './FileUpload'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onImport: (tickets: Ticket[], options: ImportOptions) => Promise<void>
  existingTickets: Ticket[]
}

const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onClose,
  onImport,
  existingTickets: _existingTickets
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    format: 'csv',
    handleDuplicates: 'skip',
    validateOnly: false
  })
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const steps = ['Select File', 'Preview & Configure', 'Import']

  const handleFileSelect = async (file: File) => {
    try {
      const format = detectFileFormat(file)
      setImportOptions(prev => ({ ...prev, format }))
      
      const previewData = await importFromFile(file, format)
      setPreview(previewData)
      setActiveStep(1)
      setImportError(null)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to process file')
    }
  }

  const handleImport = async () => {
    if (!preview) return

    setIsImporting(true)
    setImportError(null)

    try {
      await onImport(preview.tickets, importOptions)
      setActiveStep(2)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    setActiveStep(0)
    setPreview(null)
    setImportError(null)
    setIsImporting(false)
    onClose()
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Select a CSV or JSON file containing ticket data to import.
            </Typography>
            <FileUpload onFileSelect={handleFileSelect} />
            {importError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {importError}
              </Alert>
            )}
          </Box>
        )

      case 1:
        if (!preview) return null

        return (
          <Box sx={{ py: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Import Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  label={`${preview.validRows} Valid`} 
                  color="success" 
                  icon={<SuccessIcon />} 
                />
                <Chip 
                  label={`${preview.invalidRows} Invalid`} 
                  color="error" 
                  icon={<ErrorIcon />} 
                />
                <Chip 
                  label={`${preview.totalRows} Total`} 
                  variant="outlined" 
                />
              </Box>
            </Box>

            {preview.errors.length > 0 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Validation Errors Found:
                </Typography>
                {preview.errors.slice(0, 5).map((error, index) => (
                  <Typography key={index} variant="body2">
                    {error.row && `Row ${error.row}: `}{error.message}
                  </Typography>
                ))}
                {preview.errors.length > 5 && (
                  <Typography variant="body2">
                    ... and {preview.errors.length - 5} more errors
                  </Typography>
                )}
              </Alert>
            )}

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Handle Duplicates:
              </Typography>
              <RadioGroup
                value={importOptions.handleDuplicates}
                onChange={(e) => setImportOptions(prev => ({ 
                  ...prev, 
                  handleDuplicates: e.target.value as any 
                }))}
              >
                <FormControlLabel value="skip" control={<Radio />} label="Skip duplicates" />
                <FormControlLabel value="overwrite" control={<Radio />} label="Overwrite existing" />
                <FormControlLabel value="merge" control={<Radio />} label="Merge and update" />
              </RadioGroup>
            </FormControl>

            {preview.tickets.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Preview (first 5 tickets):
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {preview.tickets.slice(0, 5).map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            {ticket.name} {ticket.surname}
                          </TableCell>
                          <TableCell>{ticket.email}</TableCell>
                          <TableCell>{ticket.company}</TableCell>
                          <TableCell>
                            <Chip 
                              label={ticket.priority} 
                              size="small"
                              color={
                                ticket.priority === 'high' ? 'error' :
                                ticket.priority === 'medium' ? 'warning' : 'success'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )

      case 2:
        return (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <SuccessIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Import Completed Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {preview?.validRows} tickets have been imported.
            </Typography>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Import Tickets
        <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        {isImporting && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Importing tickets...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 && (
          <>
            <Button onClick={handleClose}>Cancel</Button>
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={() => setActiveStep(0)}
              disabled={isImporting}
            >
              Back
            </Button>
            <Button 
              onClick={handleImport}
              variant="contained"
              disabled={!preview || preview.validRows === 0 || isImporting}
            >
              Import {preview?.validRows} Tickets
            </Button>
          </>
        )}
        
        {activeStep === 2 && (
          <Button onClick={handleClose} variant="contained">
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ImportDialog
