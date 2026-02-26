import React, { useState } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Typography
} from '@mui/material'
import {
  FileDownload as ExportIcon,
  Description as CsvIcon,
  Code as JsonIcon
} from '@mui/icons-material'
import { Ticket } from '../types/ticket'
import { ExportFormat, ExportOptions } from '../types/importExport'
import { exportTickets, generateDefaultFilename } from '../utils/exportUtils'

interface ExportButtonProps {
  tickets: Ticket[]
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const ExportButton: React.FC<ExportButtonProps> = ({
  tickets,
  disabled = false,
  size = 'medium'
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [customFilename, setCustomFilename] = useState('')

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleFormatSelect = (format: ExportFormat) => {
    setSelectedFormat(format)
    setShowOptions(true)
    handleMenuClose()
    setCustomFilename(generateDefaultFilename(format))
  }

  const handleExport = () => {
    const options: ExportOptions = {
      format: selectedFormat,
      includeMetadata,
      filename: customFilename || undefined
    }

    try {
      exportTickets(tickets, options)
      setShowOptions(false)
      setCustomFilename('')
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleOptionsClose = () => {
    setShowOptions(false)
    setCustomFilename('')
  }

  const isMenuOpen = Boolean(anchorEl)

  return (
    <>
      <Button
        variant="contained"
        startIcon={<ExportIcon />}
        onClick={handleMenuClick}
        disabled={disabled || tickets.length === 0}
        size={size}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          '&:disabled': {
            bgcolor: 'action.disabled',
            color: 'action.disabled',
          }
        }}
      >
        Export ({tickets.length})
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={() => handleFormatSelect('csv')}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as CSV" />
        </MenuItem>
        <MenuItem onClick={() => handleFormatSelect('json')}>
          <ListItemIcon>
            <JsonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Export as JSON" />
        </MenuItem>
      </Menu>

      <Dialog open={showOptions} onClose={handleOptionsClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Export as {selectedFormat.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Filename"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={generateDefaultFilename(selectedFormat)}
              fullWidth
            />

            {selectedFormat === 'json' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                  />
                }
                label="Include metadata (export date, statistics)"
              />
            )}

            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Export Summary:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {tickets.length} tickets will be exported
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Format: {selectedFormat.toUpperCase()}
              </Typography>
              {selectedFormat === 'json' && (
                <Typography variant="body2" color="text.secondary">
                  • Metadata: {includeMetadata ? 'Included' : 'Not included'}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOptionsClose}>Cancel</Button>
          <Button 
            onClick={handleExport} 
            variant="contained"
            disabled={!customFilename.trim()}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExportButton
