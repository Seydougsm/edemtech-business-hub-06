
import React, { useState, useMemo } from 'react';
import { FileText, Plus, Eye, Edit, Trash2, Send, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuotes, useUpdateQuoteStatus } from '@/hooks/useQuotes';
import CreateQuoteModal from './CreateQuoteModal';
import QuoteViewModal from './QuoteViewModal';

const QuotesModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewQuote, setViewQuote] = useState(null);

  const { data: quotes = [], isLoading } = useQuotes();
  const updateStatusMutation = useUpdateQuoteStatus();

  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      const matchesSearch = quote.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-500', text: 'Brouillon', icon: Edit },
      sent: { color: 'bg-blue-500', text: 'Envoyé', icon: Send },
      accepted: { color: 'bg-green-500', text: 'Accepté', icon: Check },
      rejected: { color: 'bg-red-500', text: 'Rejeté', icon: X },
      expired: { color: 'bg-orange-500', text: 'Expiré', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleStatusChange = (quoteId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: quoteId, status: newStatus as any });
  };

  if (isLoading) {
    return <div className="p-6">Chargement des devis...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Devis</h1>
            <p className="text-gray-600">
              Créez et gérez vos devis - {quotes.length} devis au total
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Devis
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Rechercher par client ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyé</option>
            <option value="accepted">Accepté</option>
            <option value="rejected">Rejeté</option>
            <option value="expired">Expiré</option>
          </select>
        </div>

        {/* Quotes List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredQuotes.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devis trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Aucun devis ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre premier devis.'}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un devis
              </Button>
            </Card>
          ) : (
            filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{quote.quote_number}</h3>
                        {getStatusBadge(quote.status)}
                      </div>
                      <p className="text-gray-600 mb-1">
                        Client: {quote.customer_name || 'Client anonyme'}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Créé le: {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Valide jusqu'au: {new Date(quote.valid_until).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {quote.total.toLocaleString()} FCFA
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewQuote(quote)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {quote.status === 'draft' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(quote.id, 'sent')}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {quote.status === 'sent' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(quote.id, 'accepted')}
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(quote.id, 'rejected')}
                              className="text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <CreateQuoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <QuoteViewModal
        isOpen={!!viewQuote}
        onClose={() => setViewQuote(null)}
        quote={viewQuote}
      />
    </div>
  );
};

export default QuotesModule;
