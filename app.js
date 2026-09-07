const scenarioTable = [
  { item: 'Strawberries', deliveryDate: '2026-10-10', expiryDate: '2026-10-15', daysInStock: 5, expectedTier: '50% markdown' },
  { item: 'Baby spinach', deliveryDate: '2026-10-11', expiryDate: '2026-10-15', daysInStock: 4, expectedTier: '50% markdown' },
  { item: 'Avocados', deliveryDate: '2026-10-09', expiryDate: '2026-10-17', daysInStock: 6, expectedTier: 'Review' },
  { item: 'Cherry tomatoes', deliveryDate: '2026-10-08', expiryDate: '2026-10-17', daysInStock: 7, expectedTier: 'Review' },
  { item: 'Cos lettuce', deliveryDate: '2026-10-12', expiryDate: '2026-10-19', daysInStock: 3, expectedTier: 'No markdown' },
  { item: 'Blueberries', deliveryDate: '2026-10-12', expiryDate: '2026-10-20', daysInStock: 3, expectedTier: 'No markdown' },
  { item: 'Cucumbers', deliveryDate: '2026-10-13', expiryDate: '2026-10-21', daysInStock: 2, expectedTier: 'No markdown' },
  { item: 'Capsicum', deliveryDate: '2026-10-12', expiryDate: '2026-10-22', daysInStock: 4, expectedTier: 'No markdown' },
  { item: 'Kale', deliveryDate: '2026-10-13', expiryDate: '2026-10-23', daysInStock: 2, expectedTier: 'No markdown' }
];

const initialItems = [
  { id: 'strawberries', name: 'Strawberries', location: 'Produce / Shelf 04', daysLeft: 1, tier: '50% markdown', action: 'Apply 50% markdown sticker', emoji: '🍓', tone: 'pink', price: '$2.49', originalPrice: '$4.99' },
  { id: 'spinach', name: 'Baby spinach', location: 'Produce / Shelf 07', daysLeft: 1, tier: '50% markdown', action: 'Apply 50% markdown sticker', emoji: '🥬', tone: 'green', price: '$1.75', originalPrice: '$3.49' },
  { id: 'avocados', name: 'Avocados', location: 'Produce / Shelf 02', daysLeft: 2, tier: 'Review', action: 'Inspect and review for markdown', emoji: '🥑', tone: 'green', price: '$2.99', originalPrice: '$4.99' },
  { id: 'cherry-tomatoes', name: 'Cherry tomatoes', location: 'Produce / Shelf 05', daysLeft: 3, tier: 'Review', action: 'Inspect and review for markdown', emoji: '🍅', tone: 'red', price: '$2.49', originalPrice: '$3.99' }
];

let activeItems = [...initialItems];
const views = ['staff-view', 'staff-detail', 'customer-view', 'price-view'];
const worklist = document.querySelector('#worklist');
const emptyState = document.querySelector('#empty-state');
const openCount = document.querySelector('#open-count');
const detailContent = document.querySelector('#detail-content');

function getMarkdownTier(daysLeft) {
  if (daysLeft <= 1) return '50% markdown';
  if (daysLeft <= 3) return 'Review';
  return 'No markdown';
}

function rankWorklist(items) {
  return [...items].sort((first, second) => first.daysLeft - second.daysLeft);
}

function runScenarioChecks() {
  const results = scenarioTable.map((scenario) => {
    const daysLeft = Math.round((new Date(`${scenario.expiryDate}T00:00:00`) - new Date('2026-10-14T00:00:00')) / 86400000);
    return { item: scenario.item, pass: getMarkdownTier(daysLeft) === scenario.expectedTier };
  });
  console.table(results);
  window.markdownSignalVerification = { scenarioTable, results, allPassed: results.every((result) => result.pass) };
}

function renderWorklist() {
  const rankedItems = rankWorklist(activeItems);
  worklist.innerHTML = rankedItems.map((item) => `
    <button class="work-item" data-item-id="${item.id}">
      <span class="item-image ${item.tone}" aria-hidden="true">${item.emoji}</span>
      <span class="item-info"><strong>${item.name}</strong><span>${item.location}</span></span>
      <span class="urgency ${item.daysLeft > 1 ? 'review' : ''}">${item.daysLeft} day${item.daysLeft === 1 ? '' : 's'} left</span>
      <span class="chevron" aria-hidden="true">&rsaquo;</span>
    </button>`).join('');
  openCount.textContent = `${rankedItems.length} open`;
  worklist.classList.toggle('hidden', rankedItems.length === 0);
  emptyState.classList.toggle('hidden', rankedItems.length !== 0);
}

function showDetail(itemId) {
  const item = activeItems.find((candidate) => candidate.id === itemId);
  if (!item) return;
  detailContent.innerHTML = `
    <div class="detail-kicker"><span class="urgency ${item.daysLeft > 1 ? 'review' : ''}">${item.daysLeft} day${item.daysLeft === 1 ? '' : 's'} left</span><span class="eyebrow">Check ${activeItems.indexOf(item) + 1} of ${activeItems.length}</span></div>
    <div class="detail-art ${item.tone}" aria-hidden="true">${item.emoji}</div>
    <p class="eyebrow">Flagged produce</p><h2 id="detail-heading" class="detail-heading">${item.name}</h2><p class="location">${item.location}</p>
    <div class="action-card"><span class="action-mark" aria-hidden="true">!</span><div><span>Suggested action</span><strong>${item.action}</strong></div></div>
    <button class="confirm-button" data-confirm-id="${item.id}">Confirm checked</button>`;
  showView('staff-detail');
}

function showView(viewId) {
  views.forEach((id) => document.querySelector(`#${id}`).classList.toggle('active', id === viewId));
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === (viewId === 'staff-detail' ? 'staff-view' : viewId === 'price-view' ? 'customer-view' : viewId)));
}

document.addEventListener('click', (event) => {
  const itemButton = event.target.closest('[data-item-id]');
  if (itemButton) showDetail(itemButton.dataset.itemId);
  const confirmButton = event.target.closest('[data-confirm-id]');
  if (confirmButton) {
    activeItems = activeItems.filter((item) => item.id !== confirmButton.dataset.confirmId);
    renderWorklist();
    showView('staff-view');
  }
  const navButton = event.target.closest('[data-view]');
  if (navButton) showView(navButton.dataset.view);
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'back-to-staff') showView('staff-view');
  if (action === 'back-to-customer') showView('customer-view');
  if (action === 'show-price') showView('price-view');
  if (action === 'reset') { activeItems = [...initialItems]; renderWorklist(); }
});

renderWorklist();
runScenarioChecks();
