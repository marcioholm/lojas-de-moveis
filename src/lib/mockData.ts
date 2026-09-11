export const mockProducts = [
  { id: '1', nome: 'Sofá Retrátil Torino 2,30m Veludo', sku: 'SF-TOR-230-VEL-CZ', preco: 2499.90, estoque: 12, reservado: 2, status: 'Em Estoque', categoria: 'Estofados', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
  { id: '2', nome: 'Mesa de Jantar Ágata 6 Lugares c/ Vidro', sku: 'MS-AGA-6L-VD-IMB', preco: 1850.00, estoque: 4, reservado: 0, status: 'Baixo Estoque', categoria: 'Salas de Jantar', img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=400' },
  { id: '3', nome: 'Guarda-Roupa Casal Mônaco 6 Portas', sku: 'GR-MON-6P-BR', preco: 1290.00, estoque: 18, reservado: 5, status: 'Em Estoque', categoria: 'Quartos', img: 'https://images.unsplash.com/photo-1595526114101-1779dd18037c?auto=format&fit=crop&q=80&w=400' },
  { id: '4', nome: 'Painel para TV até 65" Ripado', sku: 'PN-RIP-65-NAT', preco: 789.90, estoque: 0, reservado: 0, status: 'Sem Estoque', categoria: 'Salas de Estar', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400' },
  { id: '5', nome: 'Cama Box Queen Size Molas Ensacadas', sku: 'CB-QUE-MOL-BR', preco: 1599.00, estoque: 8, reservado: 1, status: 'Em Estoque', categoria: 'Quartos', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=400' },
  { id: '6', nome: 'Poltrona Decorativa Costela c/ Puff', sku: 'PL-COS-PUF-CR', preco: 890.00, estoque: 3, reservado: 0, status: 'Baixo Estoque', categoria: 'Estofados', img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400' }
]

export const mockClients = [
  { id: '1', nome: 'Maria Silva Oliveira', cpf: '123.456.789-00', telefone: '(11) 98765-4321', cidade: 'São Paulo - SP', ultimaCompra: '2023-10-25', status: 'Ativo', totalComprado: 3450.00 },
  { id: '2', nome: 'João Pedro Santos', cpf: '987.654.321-11', telefone: '(11) 91234-5678', cidade: 'Osasco - SP', ultimaCompra: '2023-09-15', status: 'Inadimplente', totalComprado: 1290.00 },
  { id: '3', nome: 'Ana Clara Souza', cpf: '456.789.123-22', telefone: '(11) 99988-7766', cidade: 'Guarulhos - SP', ultimaCompra: '2023-10-28', status: 'Ativo', totalComprado: 5890.00 },
  { id: '4', nome: 'Carlos Eduardo Ferreira', cpf: '321.654.987-33', telefone: '(11) 97766-5544', cidade: 'São Paulo - SP', ultimaCompra: '2023-08-10', status: 'Inativo', totalComprado: 890.00 },
  { id: '5', nome: 'Beatriz Almeida', cpf: '654.321.789-44', telefone: '(11) 95544-3322', cidade: 'São Bernardo - SP', ultimaCompra: '2023-10-20', status: 'Ativo', totalComprado: 2499.90 },
]

export const mockSales = [
  { id: 'VD-1024', cliente: 'Maria Silva Oliveira', vendedor: 'Carlos (Loja 1)', data: '28/10/2023 14:30', valor: 3450.00, formaPagamento: 'Cartão 10x', status: 'Aprovada' },
  { id: 'VD-1025', cliente: 'João Pedro Santos', vendedor: 'Ana (Loja 1)', data: '28/10/2023 15:45', valor: 1290.00, formaPagamento: 'Crediário 12x', status: 'Aguardando Análise' },
  { id: 'VD-1026', cliente: 'Cliente Balcão', vendedor: 'Roberto (Loja 1)', data: '28/10/2023 16:10', valor: 450.00, formaPagamento: 'PIX', status: 'Aprovada' },
  { id: 'VD-1027', cliente: 'Beatriz Almeida', vendedor: 'Carlos (Loja 1)', data: '28/10/2023 17:05', valor: 2499.90, formaPagamento: 'Cartão 12x', status: 'Cancelada' },
]

export const mockPedidos = [
  { id: 'PD-501', cliente: 'Maria Silva Oliveira', dataPrevista: '05/11/2023', produtos: 'Sofá Retrátil Torino...', valor: 2499.90, status: 'Montagem Pendente', origem: 'Loja Física' },
  { id: 'PD-502', cliente: 'Ana Clara Souza', dataPrevista: '02/11/2023', produtos: 'Mesa Ágata 6 Lug...', valor: 1850.00, status: 'Aguardando Estoque', origem: 'E-commerce' },
  { id: 'PD-503', cliente: 'Carlos Eduardo Ferreira', dataPrevista: '30/10/2023', produtos: 'Poltrona Costela...', valor: 890.00, status: 'Pronto para Entrega', origem: 'Loja Física' },
]
