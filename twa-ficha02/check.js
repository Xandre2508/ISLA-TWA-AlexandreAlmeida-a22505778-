import assert from 'node:assert/strict';
import { items } from './data.js';
import { byCategory, search, total, top, categories, withDiscount } from './catalog.js';

// 1. byCategory: Sabemos que existem 4 jogos na categoria 'Ação'
assert.equal(byCategory(items, 'Ação').length, 4);

// 2. search: Sabemos que ao pesquisar "Batata", deve encontrar 1 jogo
assert.equal(search(items, 'Batata').length, 1);

// 3. top: O jogo mais caro da lista (59.99) é o 'God of War Ragnarok'
assert.equal(top(items, 1)[0].name, 'God of War Ragnarok');

// 4. categories: Devem ser 3 categorias únicas e ordenadas alfabeticamente
assert.deepEqual(categories(items), ['Aventura', 'Ação', 'RPG']);

// 5. withDiscount: Se aplicarmos 50% de desconto a uma lista pequena para teste rápido
const testeDesconto = [{ price: 20, name: 'Teste' }];
assert.equal(withDiscount(testeDesconto, 50)[0].price, 10);

// 6. total: A soma de uma lista de teste rápida deve estar correta
const testeSoma = [{ price: 10 }, { price: 25.5 }];
assert.equal(total(testeSoma), 35.5);