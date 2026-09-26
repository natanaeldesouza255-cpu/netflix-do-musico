import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceItem } from '../data/mockData';
import { ShoppingBag, ArrowRight, X, ShieldCheck, Sparkles, CreditCard, CheckCircle, Tag } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { user, marketplaceItems } = useApp();
  
  const [activeFilter, setActiveFilter] = useState<string>('Tudo');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceItem | null>(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeItems = marketplaceItems.filter(item => item.status !== 'inactive');
  const filtersList = ['Tudo', ...Array.from(new Set(activeItems.map(item => item.type)))];

  const filteredItems = activeFilter === 'Tudo'
    ? activeItems
    : activeItems.filter(item => item.type === activeFilter);

  const handleOpenCheckout = (product: MarketplaceItem) => {
    setSelectedProduct(product);
    setCheckoutComplete(false);
    setIsProcessing(false);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsProcessing(true);
    // Simula processamento da transação financeira de teste
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutComplete(true);
      
      // Se estiver logado, ganha XP por investir na carreira!
      if (user) {
        // Incrementamos XP de forma fictícia no contexto global
        user.xp += 150;
      }
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col gap-6" id="marketplace-page-root">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
        <div>
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <ShoppingBag className="h-5.5 w-5.5 text-purple-500" />
            Marketplace de Presets & VSTs
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Turbine seu áudio e estúdio. Encontre presets de amplificadores, sample packs de baterias reais microfonadas e VSTs exclusivos de produção.
          </p>
        </div>
      </div>

      {/* FILTROS DO MARKETPLACE */}
      <section className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-zinc-900/60 -mx-4 px-4 sm:mx-0 sm:px-0">
        {filtersList.map(filt => (
          <button
            key={filt}
            onClick={() => setActiveFilter(filt)}
            className={`flex-none text-xs font-bold px-4 py-2 rounded-full border transition focus:outline-none ${
              activeFilter === filt
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-400'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            id={`filter-mkt-${filt.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {filt}
          </button>
        ))}
      </section>

      {/* GRADE DE PRODUTOS DIGITAIS */}
      {filteredItems.length === 0 ? (
        <section className="glass-panel rounded-2xl border border-zinc-800 p-10 text-center text-sm text-zinc-500">
          Nenhum produto ativo nesta categoria no momento.
        </section>
      ) : (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="group glass-panel rounded-xl overflow-hidden hover:scale-[1.01] hover:-translate-y-0.5 transition-glow transition-all duration-300 border border-zinc-800 hover:border-purple-500/40 neon-glow-purple flex flex-col justify-between"
            id={`mkt-card-${item.id}`}
          >
            <div>
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                
                {/* Tipo de Produto Badge */}
                <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider bg-zinc-950/80 border border-zinc-700 text-purple-400 px-2 py-0.5 rounded flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {item.type}
                </span>
              </div>

              {/* Detalhes */}
              <div className="p-4 text-left">
                <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-purple-400 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Preço e Botão */}
            <div className="p-4 pt-0 mt-2 flex items-center justify-between border-t border-zinc-900/40">
              <div className="text-left">
                <span className="text-[9px] text-zinc-550 block uppercase tracking-widest leading-none">Preço Único</span>
                <span className="text-base font-black text-white font-mono block mt-1">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                onClick={() => handleOpenCheckout(item)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] px-4 py-2 rounded-lg flex items-center gap-1.5 transition duration-300 focus:outline-none"
                id={`btn-buy-mkt-${item.id}`}
              >
                Comprar Licença
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </section>
      )}

      {/* FUTURO AVISO / CHAMADO */}
      <section className="glass-panel rounded-2xl p-6 border border-zinc-800 bg-gradient-to-r from-zinc-950 to-purple-950/15 text-center flex flex-col items-center gap-3">
        <div className="inline-flex h-9 w-9 bg-purple-500/10 border border-purple-500/20 text-purple-400 items-center justify-center rounded-lg">
          <Sparkles className="h-5 w-5 fill-purple-550/10" />
        </div>
        <h3 className="font-heading text-sm sm:text-base font-bold text-white uppercase tracking-wider">Você é produtor ou criador de VSTs/Sample Packs?</h3>
        <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
          Em breve abriremos inscrições para que professores e produtores parceiros possam vender seus próprios presets de amplificadores e timbres de Reaper diretamente na nossa vitrine, monetizando seu conhecimento!
        </p>
      </section>

      {/* MODAL CHECKOUT DE SIMULAÇÃO */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="w-full max-w-md glass-panel border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl animate-scale-up text-left">
            
            {/* Header Checkout */}
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/60">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-purple-400" />
                Checkout VIP Simulado
              </span>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/80 p-1.5 rounded-full transition focus:outline-none"
                id="btn-close-checkout"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tela de Sucesso */}
            {checkoutComplete ? (
              <div className="p-6 text-center flex flex-col items-center gap-4 animate-scale-up">
                <div className="h-12 w-12 bg-green-500/10 border border-green-500/25 text-green-400 flex items-center justify-center rounded-full shadow-inner animate-bounce">
                  <CheckCircle className="h-6.5 w-6.5 fill-green-950/15" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Transação Simulada Efetuada!</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xs mx-auto">
                    Parabéns! Sua licença digital para o produto <strong className="text-white">"{selectedProduct.name}"</strong> foi ativada.
                  </p>
                  <p className="text-[10px] text-zinc-550 leading-relaxed max-w-xs mx-auto mt-2">
                    Os arquivos zip, chaves seriais de VST e presets de Reaper foram enviados para seu e-mail cadastrado.
                  </p>
                </div>
                <div className="bg-purple-950/40 border border-purple-500/20 text-purple-300 text-[10px] font-bold px-3.5 py-1 rounded-full font-mono">
                  🚀 +150 XP de Evolução Musical Recebidos!
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="mt-2 bg-zinc-900 border border-zinc-800 text-white font-bold text-xs px-6 py-2 rounded-lg transition"
                  id="btn-checkout-done-close"
                >
                  Fechar Janela
                </button>
              </div>
            ) : (
              // Formulário de Pagamento Mock
              <form onSubmit={handleCheckoutSubmit} className="p-5 flex flex-col gap-4">
                
                {/* Resumo do Pedido */}
                <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[9px] bg-purple-950 text-purple-400 px-1.5 py-0.2 rounded font-mono uppercase tracking-wider block w-fit mb-0.5">Item</span>
                    <span className="text-xs font-bold text-white line-clamp-1">{selectedProduct.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-white font-mono">
                      R$ {selectedProduct.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Nome titular */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Titular do Cartão (Simulação)</label>
                    <input 
                      type="text"
                      placeholder="Músico Estudante da Silva"
                      className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-600 focus:border-purple-400 focus:outline-none transition"
                      required
                      id="input-card-name"
                    />
                  </div>

                  {/* Número Cartão */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Número do Cartão de Crédito</label>
                    <input 
                      type="text"
                      placeholder="4000 1234 5678 9010 (Qualquer número funciona)"
                      className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-650 focus:border-purple-400 focus:outline-none transition"
                      required
                      id="input-card-number"
                    />
                  </div>

                  {/* CVV & Vencimento */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Validade</label>
                      <input 
                        type="text"
                        placeholder="12/29"
                        className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-600 focus:border-purple-400 focus:outline-none transition"
                        required
                        id="input-card-expiry"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">CVV</label>
                      <input 
                        type="password"
                        placeholder="***"
                        className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-600 focus:border-purple-400 focus:outline-none transition"
                        required
                        id="input-card-cvv"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-zinc-550 leading-relaxed flex items-start gap-1 p-2 bg-zinc-950 rounded-lg border border-zinc-900">
                  <ShieldCheck className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Ambiente de simulação 100% seguro. Nenhum dado financeiro real é enviado ou debitado do seu cartão neste MVP.
                  </span>
                </div>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="mt-2 w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  id="btn-checkout-submit"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando transação criptografada...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 fill-purple-950/15" />
                      <span>Efetuar Compra Simulada</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
export default MarketplacePage;
