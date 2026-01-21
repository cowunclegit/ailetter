import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Container, 
  Box, 
  CircularProgress, 
  Typography,
  Button,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import DraggableItem from '../components/features/DraggableItem';
import NewsletterPreview from '../components/features/NewsletterPreview';
import RichTextEditor from '../components/features/RichTextEditor';
import TemplateGrid from '../components/features/TemplateGrid';
import { useFeedback } from '../contexts/FeedbackContext';
import { aiPresetsApi } from '../api/aiPresetsApi';

const API_URL = '/api';

const NewsletterDraft = () => {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('classic-list');
  const [aiPresets, setAiPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [subject, setSubject] = useState('');
  const [introductionHtml, setIntroductionHtml] = useState('');
  const [conclusionHtml, setConclusionHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const { showFeedback } = useFeedback();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchNewsletter();
    fetchTemplates();
    fetchAiPresets();
    fetchPreview();
  }, [id]);

  const fetchNewsletter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/newsletters/${id}`);
      setNewsletter(response.data);
      setItems(response.data.items);
      setTemplateId(response.data.template_id || 'classic-list');
      setSubject(response.data.subject || '');
      setIntroductionHtml(response.data.introduction_html || '');
      setConclusionHtml(response.data.conclusion_html || '');
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      showFeedback('Failed to load newsletter draft.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchAiPresets = async () => {
    try {
      const response = await aiPresetsApi.getAll();
      const presets = response || [];
      setAiPresets(presets);
      if (presets.length > 0 && !selectedPresetId) {
        setSelectedPresetId(presets[0].id);
      }
    } catch (error) {
      console.error('Error fetching AI presets:', error);
    }
  };

  const handleTemplateSelect = async (newId) => {
    setTemplateId(newId);
    try {
      await axios.put(`${API_URL}/newsletters/${id}`, { 
        template_id: newId
      });
      showFeedback('Template updated', 'success');
      fetchPreview();
    } catch (error) {
      console.error('Error updating template:', error);
      showFeedback('Failed to update template.', 'error');
    }
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleAIRecommend = async () => {
    if (!selectedPresetId) {
      showFeedback('Please select an AI preset first.', 'warning');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/newsletters/${id}/ai-recommend-subject`, {
        preset_id: selectedPresetId,
        current_subject: subject
      });
      const newSubject = response.data.suggested_subject;
      setSubject(newSubject);
      
      // Persist immediately
      await axios.put(`${API_URL}/newsletters/${id}`, { 
        subject: newSubject
      });
      
      showFeedback('AI suggested a new subject', 'info');
      fetchPreview();
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      showFeedback('Failed to get AI recommendation.', 'error');
    }
  };

  const saveDraftContent = async () => {
    try {
      await axios.put(`${API_URL}/newsletters/${id}`, { 
        subject,
        introduction_html: introductionHtml,
        conclusion_html: conclusionHtml
      });
      showFeedback('Draft updated successfully', 'success');
      fetchPreview();
    } catch (error) {
      console.error('Error saving draft content:', error);
      showFeedback('Failed to save draft changes.', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;

    try {
      await axios.delete(`${API_URL}/newsletters/${id}/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));
      showFeedback('Item removed successfully', 'success');
      fetchPreview();
    } catch (error) {
      console.error('Error deleting item:', error);
      showFeedback('Failed to remove item.', 'error');
    }
  };

  const fetchPreview = async () => {
    setPreviewLoading(true);
    try {
      const response = await axios.get(`${API_URL}/newsletters/${id}/preview`);
      setPreviewHtml(response.data);
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSendTest = async () => {
    setSending(true);
    try {
      await axios.post(`${API_URL}/newsletters/${id}/send-test`);
      showFeedback('Test email sent to administrator.', 'info');
    } catch (error) {
      console.error('Error sending test email:', error);
      showFeedback('Failed to send test email.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Persist to backend
      try {
        const itemOrders = newItems.map((item, index) => ({
          trend_item_id: item.id,
          display_order: index
        }));
        await axios.put(`${API_URL}/newsletters/${id}/reorder`, { item_orders: itemOrders });
        showFeedback('Order updated successfully', 'success');
        fetchPreview(); // Refresh preview after reordering
      } catch (error) {
        console.error('Error updating order:', error);
        showFeedback('Failed to save new order.', 'error');
        // Rollback on failure? For now, just show error
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!newsletter) {
    return <Typography variant="h6">Newsletter not found.</Typography>;
  }

  return (
    <Container maxWidth="md">
      <PageHeader 
        title={`Organize Newsletter #${newsletter.issue_number}`} 
      />
      
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                value={subject}
                onChange={handleSubjectChange}
                onBlur={saveDraftContent}
                placeholder="Newsletter Subject"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>AI Preset</InputLabel>
                <Select
                  value={selectedPresetId}
                  label="AI Preset"
                  onChange={(e) => setSelectedPresetId(e.target.value)}
                >
                  {aiPresets.map((preset) => (
                    <MenuItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                onClick={handleAIRecommend}
                sx={{ whiteSpace: 'nowrap', height: '40px' }}
                disabled={aiPresets.length === 0}
              >
                AI Recommend
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <RichTextEditor 
          label="Introduction" 
          value={introductionHtml} 
          onChange={setIntroductionHtml} 
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={saveDraftContent} size="small">
            Save Introduction
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Drag to Reorder Items</Typography>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <DraggableItem 
                key={item.id} 
                id={item.id} 
                title={item.title} 
                source={item.source_name} 
                date={new Date(item.published_at).toLocaleDateString()} 
                originalUrl={item.original_url}
                onDelete={handleDeleteItem}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <RichTextEditor 
          label="Conclusion" 
          value={conclusionHtml} 
          onChange={setConclusionHtml} 
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" onClick={saveDraftContent} size="small">
            Save Conclusion
          </Button>
        </Box>
      </Box>

      <TemplateGrid 
        templates={templates} 
        selectedId={templateId} 
        onSelect={handleTemplateSelect} 
      />

      <NewsletterPreview 
        subject={subject}
        html={previewHtml} 
        loading={previewLoading} 
        onSendTest={handleSendTest}
        sendingTest={sending}
      />
    </Container>
  );
};

export default NewsletterDraft;