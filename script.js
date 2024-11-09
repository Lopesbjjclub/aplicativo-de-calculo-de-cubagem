// Seleção dos elementos DOM
const form = {
    altura: document.getElementById('altura'),
    largura: document.getElementById('largura'),
    comprimento: document.getElementById('comprimento'),
    unidade: document.getElementById('unit'),
    btnCalcular: document.getElementById('calcular'),
    btnLimpar: document.getElementById('limpar'),
    resultado: document.querySelector('.result-value'),
    resultadoUnidade: document.querySelector('.result-unit'),
    historicoLista: document.getElementById('historico'),
    errorMessage: document.getElementById('error-message')
};

// Histórico de cálculos
let historico = [];

// Carregar histórico do localStorage
document.addEventListener('DOMContentLoaded', () => {
    const historicoSalvo = localStorage.getItem('historicoCalculos');
    if (historicoSalvo) {
        historico = JSON.parse(historicoSalvo);
        atualizarHistorico();
    }
});

// Função para validar inputs
function validarInputs(altura, largura, comprimento) {
    if (altura <= 0 || largura <= 0 || comprimento <= 0) {
        mostrarErro('Todas as medidas devem ser maiores que zero');
        return false;
    }
    if (isNaN(altura) || isNaN(largura) || isNaN(comprimento)) {
        mostrarErro('Por favor, insira apenas números válidos');
        return false;
    }
    esconderErro();
    return true;
}

// Função para calcular volume
function calcularVolume(altura, largura, comprimento, unidade) {
    let volume = altura * largura * comprimento;
    
    // Converter para metros cúbicos se necessário
    if (unidade === 'cm') {
        volume = volume / 1000000; // Converter de cm³ para m³
    }
    
    return volume;
}

// Função para formatar o número
function formatarNumero(numero) {
    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    });
}

// Função para adicionar ao histórico
function adicionarAoHistorico(altura, largura, comprimento, unidade, resultado) {
    const calculo = {
        data: new Date().toLocaleString(),
        medidas: {
            altura,
            largura,
            comprimento,
            unidade
        },
        resultado
    };
    
    historico.unshift(calculo); // Adiciona no início do array
    if (historico.length > 10) { // Mantém apenas os últimos 10 cálculos
        historico.pop();
    }
    
    localStorage.setItem('historicoCalculos', JSON.stringify(historico));
    atualizarHistorico();
}

// Função para atualizar a exibição do histórico
function atualizarHistorico() {
    form.historicoLista.innerHTML = '';
    historico.forEach(calculo => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${calculo.data}<br>
            Medidas: ${calculo.medidas.altura} × ${calculo.medidas.largura} × ${calculo.medidas.comprimento} ${calculo.medidas.unidade}
            = ${calculo.resultado} m³
        `;
        form.historicoLista.appendChild(li);
    });
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    form.errorMessage.textContent = mensagem;
    form.errorMessage.classList.add('show');
}

// Função para esconder erro
function esconderErro() {
    form.errorMessage.textContent = '';
    form.errorMessage.classList.remove('show');
}

// Função para limpar campos
function limparCampos() {
    form.altura.value = '';
    form.largura.value = '';
    form.comprimento.value = '';
    form.resultado.textContent = '0';
    esconderErro();
}

// Event Listeners
form.btnCalcular.addEventListener('click', () => {
    const altura = parseFloat(form.altura.value);
    const largura = parseFloat(form.largura.value);
    const comprimento = parseFloat(form.comprimento.value);
    const unidade = form.unidade.value;

    if (validarInputs(altura, largura, comprimento)) {
        const volume = calcularVolume(altura, largura, comprimento, unidade);
        const volumeFormatado = formatarNumero(volume);
        
        form.resultado.textContent = volumeFormatado;
        form.resultadoUnidade.textContent = 'm³';
        
        adicionarAoHistorico(altura, largura, comprimento, unidade, volumeFormatado);
    }
});

form.btnLimpar.addEventListener('click', limparCampos);

// Evento para inputs - remove mensagem de erro quando usuário começa a digitar
[form.altura, form.largura, form.comprimento].forEach(input => {
    input.addEventListener('input', esconderErro);
});

// Prevenção de entrada de valores negativos
[form.altura, form.largura, form.comprimento].forEach(input => {
    input.addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = '';
            mostrarErro('Não são permitidos valores negativos');
        }
    });
});

// Atualizar unidade de medida quando alterada
form.unidade.addEventListener('change', () => {
    if (form.resultado.textContent !== '0') {
        // Recalcular com a nova unidade se houver um resultado exibido
        form.btnCalcular.click();
    }
});

