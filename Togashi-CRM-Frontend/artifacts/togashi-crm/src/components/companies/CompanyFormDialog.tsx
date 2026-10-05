import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';

export interface CompanyFormData {
  name: string;
  legalName?: string | null;
  industry?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  status?: string | null;
  notes?: string | null;
}

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CompanyFormData) => void;
  initialData?: CompanyFormData | null;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

const emptyForm: CompanyFormData = {
  name: '',
  legalName: '',
  industry: '',
  website: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  status: 'ACTIVE',
  notes: '',
};

export default function CompanyFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
  errorMessage = null,
}: CompanyFormDialogProps) {
  const [form, setForm] = useState<CompanyFormData>(emptyForm);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setUrlError(null);
      if (initialData) {
        setForm({
          name: initialData.name ?? '',
          legalName: initialData.legalName ?? '',
          industry: initialData.industry ?? '',
          website: initialData.website ?? '',
          email: initialData.email ?? '',
          phone: initialData.phone ?? '',
          city: initialData.city ?? '',
          country: initialData.country ?? '',
          status: initialData.status ?? 'ACTIVE',
          notes: initialData.notes ?? '',
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, initialData]);

  const handleChange = (field: keyof CompanyFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'website') {
      setUrlError(null);
    }
  };

  const validateWebsite = (url: string): boolean => {
    if (!url.trim()) return true;
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      return !!u.hostname && u.hostname.includes('.');
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    if (!form.name.trim()) return;

    if (form.website?.trim()) {
      if (!validateWebsite(form.website)) {
        setUrlError('Please enter a valid URL (e.g. https://example.com)');
        return;
      }
    }

    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Company' : 'Add Company'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update company information.'
              : 'Only a company name is required to create a new company.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Acme Corporation"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input
                id="legalName"
                value={form.legalName || ''}
                onChange={(e) => handleChange('legalName', e.target.value)}
                placeholder="Acme Corp Ltd."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={form.industry || ''}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="Technology"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                value={form.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="info@acme.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="text"
                value={form.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+256 701 200 300"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                type="text"
                value={form.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://example.com"
              />
              {urlError && (
                <p className="text-xs text-red-600">{urlError}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status || 'ACTIVE'}
                onValueChange={(v) => handleChange('status', v)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                value={form.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Kampala"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                value={form.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="Uganda"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                type="text"
                value={form.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.name.trim()}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting
                ? (initialData ? 'Saving...' : 'Creating...')
                : (initialData ? 'Save Changes' : 'Create Company')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
