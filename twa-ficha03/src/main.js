import './style.css';
import { search, byCategory, categories, sortByPrice } from './catalog.js';

// Estado inicial exatamente como pedido na ficha
const state = {
  status: 'loading',
  error: null,
  items: [],
  query: '',
  category: '',
  sortDir: 'desc',
  selectedId: null,
};

// Elementos do DOM
const inputQ = document.querySelector('#q');
const selectCategory = document.querySelector('#category');
const btnSort = document.querySelector('#sort');
const listEl = document.querySelector('#list');
const detailEl = document.querySelector('#detail');

// 1. load() — async, fetch('/items.json'), verificar res.ok, try / catch / finally
async function load() {
  state.status = 'loading';
  state.error = null;
  render();

  try {
    const res = await fetch('/items.json');
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.url}`);
    }
    state.items = await res.json();
    state.status = 'ready';
    fillCategories();
  } catch (err) {
    state.status = 'error';
    state.error = err.message;
  } finally {
    render();
  }
}

// Preenche as opções do <select> com as categorias únicas
function fillCategories() {
  const allOpt = document.createElement('option');
  allOpt.value = '';
  allOpt.textContent = 'Todas as categorias';

  const catOptions = categories(state.items).map((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    return opt;
  });

  selectCategory.replaceChildren(allOpt, ...catOptions);
  selectCategory.value = state.category;
}

// 2. render() — lê o state, reconstrói #list e #detail com createElement + textContent
function render() {
  listEl.replaceChildren();
  detailEl.replaceChildren();

  btnSort.textContent = `Preço (${state.sortDir === 'desc' ? '↓' : '↑'})`;

  if (state.status === 'loading') {
    const li = document.createElement('li');
    li.textContent = 'A carregar...';
    listEl.append(li);
    return;
  }

  if (state.status === 'error') {
    const li = document.createElement('li');
    li.textContent = `Erro: ${state.error} `;

    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.textContent = 'Tentar de novo';
    retryBtn.addEventListener('click', () => load());

    li.append(retryBtn);
    listEl.append(li);
    return;
  }

  // Filtrar e ordenar usando as funções puras do catalog.js
  let visible = state.items;
  if (state.query) {
    visible = search(visible, state.query);
  }
  if (state.category) {
    visible = byCategory(visible, state.category);
  }
  visible = sortByPrice(visible, state.sortDir);

  if (visible.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Sem resultados';
    listEl.append(li);
  } else {
    const nodes = visible.map((item) => {
      const li = document.createElement('li');
      li.classList.add('item');
      li.dataset.id = item.id;
      li.textContent = `${item.name} — ${item.price} €`;
      return li;
    });
    listEl.replaceChildren(...nodes);
  }

  // Renderizar detalhe do item selecionado (nome, preço, tags, objeto aninhado)
  if (state.selectedId !== null) {
    const selected = state.items.find((i) => String(i.id) === String(state.selectedId));
    if (selected) {
      const h2 = document.createElement('h2');
      h2.textContent = selected.name;

      const pPrice = document.createElement('p');
      pPrice.textContent = `Preço: ${selected.price} €`;

      const pTags = document.createElement('p');
      pTags.textContent = `Tags: ${Array.isArray(selected.tags) ? selected.tags.join(', ') : ''}`;

      const nestedUl = document.createElement('ul');
      for (const [key, val] of Object.entries(selected)) {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          for (const [subKey, subVal] of Object.entries(val)) {
            const subLi = document.createElement('li');
            subLi.textContent = `${subKey}: ${subVal}`;
            nestedUl.append(subLi);
          }
        }
      }

      detailEl.replaceChildren(h2, pPrice, pTags, nestedUl);
    }
  }
}

// 3. Eventos só mudam o state, depois render()
inputQ.addEventListener('input', (e) => {
  state.query = e.target.value;
  render();
});

selectCategory.addEventListener('change', (e) => {
  state.category = e.target.value;
  render();
});

btnSort.addEventListener('click', () => {
  state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
  render();
});

// Delegação de eventos: um só listener no #list
listEl.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  state.selectedId = li.dataset.id;
  render();
});

load();