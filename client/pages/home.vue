<template>
  <div v-if="workspace" class="crm-root">

    <!-- ══════════════════════════════════════════════════════════
         HEADER
    ══════════════════════════════════════════════════════════ -->
    <header class="crm-header">
      <div class="crm-header__inner">

        <div v-if="(forms?.length > 0) || isFilteringForms" class="crm-header__search-wrap">
          <div class="crm-search-box">
            <svg class="crm-search-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <UInput v-model="search" placeholder="Search by name, tag, slug…" class="crm-search-input" />
          </div>
          <USelectMenu
            v-if="allTags.length > 0"
            v-model="selectedTags"
            :items="tagOptions"
            multiple
            placeholder="Filter tags"
            class="hidden sm:block"
            :ui="{ content: 'min-w-fit' }"
          />
          <button v-if="isFilteringForms" class="crm-clear-btn" @click="clearFilters">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Clear
          </button>
        </div>
        <div v-else class="crm-header__search-wrap" />

        <div class="crm-header__actions">
          <div class="crm-view-toggle">
            <button class="crm-view-btn" :class="{ 'crm-view-btn--on': viewMode === 'list' }" @click="viewMode = 'list'" title="List">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
            <button class="crm-view-btn" :class="{ 'crm-view-btn--on': viewMode === 'grid' }" @click="viewMode = 'grid'" title="Grid">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
          </div>
          <TrackClick name="home_top_bar_create_form_click">
            <UButton
              v-if="!workspace?.is_readonly"
              icon="i-heroicons-plus"
              label="New Form"
              :to="{ name: 'forms-create' }"
              class="crm-create-btn"
            />
          </TrackClick>
        </div>
      </div>
    </header>

    <!-- ══════════════════════════════════════════════════════════
         MAIN
    ══════════════════════════════════════════════════════════ -->
    <main class="crm-main">

      <!-- KPI Strip -->
      <section v-if="isFetched && !isFormsLoading && forms?.length > 0" class="kpi-strip">

        <div class="kpi-card kpi-card--accent">
          <div class="kpi-icon kpi-icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-num">{{ forms.length }}</div>
            <div class="kpi-lbl">Total Forms</div>
          </div>
          <div class="kpi-sparkline">
            <div v-for="(h, i) in sparkHeights" :key="i" class="kpi-spark" :style="{ height: h + '%' }" />
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-icon--emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-num">{{ activeCount }}</div>
            <div class="kpi-lbl">Active</div>
          </div>
          <span class="kpi-pill kpi-pill--green">{{ forms.length > 0 ? Math.round((activeCount / forms.length) * 100) : 0 }}%</span>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-icon--violet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-num">{{ totalResponses }}</div>
            <div class="kpi-lbl">Responses</div>
          </div>
          <div v-if="responseTrend" class="kpi-trend" :class="{ 'kpi-trend--down': !responseTrend.up }">
            <svg v-if="responseTrend.up" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
            {{ responseTrend.up ? "+" : "-" }}{{ responseTrend.pct }}%
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon kpi-icon--amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="kpi-body">
            <div class="kpi-num">{{ totalViews }}</div>
            <div class="kpi-lbl">Total Views</div>
          </div>
          <div class="kpi-sub">{{ forms.length > 0 ? Math.round(totalViews / forms.length) : 0 }} avg</div>
        </div>

        <div class="kpi-card kpi-card--wide">
          <div class="kpi-lbl kpi-lbl--top">Status Breakdown</div>
          <div class="donut-wrap">
            <svg width="72" height="72" viewBox="0 0 72 72" style="flex-shrink:0">
              <circle cx="36" cy="36" r="28" fill="none" stroke="#e8edf5" stroke-width="9"/>
              <circle cx="36" cy="36" r="28" fill="none" stroke="#4f46e5" stroke-width="9"
                :stroke-dasharray="`${donutSegments.active} ${donutC}`"
                stroke-dashoffset="0" transform="rotate(-90 36 36)"
              />
              <circle cx="36" cy="36" r="28" fill="none" stroke="#f59e0b" stroke-width="9"
                :stroke-dasharray="`${donutSegments.draft} ${donutC}`"
                :stroke-dashoffset="`-${donutSegments.active}`"
                transform="rotate(-90 36 36)"
              />
              <text x="36" y="40" text-anchor="middle" font-size="13" font-weight="800" fill="#0d1117">{{ forms.length }}</text>
            </svg>
            <div class="donut-legend">
              <div class="donut-row"><span class="d-dot" style="background:#4f46e5"/><span>Active</span><strong>{{ activeCount }}</strong></div>
              <div class="donut-row"><span class="d-dot" style="background:#f59e0b"/><span>Draft</span><strong>{{ draftCount }}</strong></div>
              <div class="donut-row"><span class="d-dot" style="background:#cbd5e1"/><span>Off</span><strong>{{ inactiveCount }}</strong></div>
            </div>
          </div>
        </div>

        <div class="kpi-card kpi-card--wide">
          <div class="kpi-lbl kpi-lbl--top">Top 5 by Responses</div>
          <div class="bar-rows">
            <div v-for="(form, i) in topResponseForms" :key="form.id" class="brow">
              <span class="brow-lbl">{{ form.title || `Form ${i+1}` }}</span>
              <div class="brow-track"><div class="brow-fill" :style="{ width: barRowWidth(form.total_submissions) }"/></div>
              <span class="brow-val">{{ form.total_submissions || 0 }}</span>
            </div>
          </div>
        </div>

      </section>

      <!-- Status filter tabs -->
      <section v-if="isFetched && !isFormsLoading && forms?.length > 0" class="table-toolbar">
        <div class="status-tabs">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            class="stab"
            :class="{ 'stab--on': activeStatusFilter === tab.key }"
            @click="setStatusFilter(tab.key)"
          >
            {{ tab.label }}
            <span class="stab-count">{{ tab.count }}</span>
          </button>
        </div>
        <span class="toolbar-total">{{ enrichedForms.length }} forms</span>
      </section>

      <!-- Forms section -->
      <section class="forms-section">
        <ClientOnly>

          <!-- 1. Loading -->
          <div v-if="isFormsLoading" class="list-table">
            <FormCardSkeleton v-for="n in 6" :key="n" />
          </div>

          <!-- 2. No forms at all -->
          <div v-else-if="isFetched && forms?.length === 0" class="crm-empty">
            <div class="empty-ico">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <h3 class="empty-title">No forms yet</h3>
            <p class="empty-desc">Create your first form to start collecting responses.</p>
            <UButton v-if="!workspace?.is_readonly" class="crm-create-btn mt-5" icon="i-heroicons-plus" label="Create First Form" :to="{ name: 'forms-create' }" />
          </div>

          <!-- 3. Filter returned nothing -->
          <div v-else-if="isFetched && forms?.length > 0 && enrichedForms.length === 0" class="crm-empty">
            <div class="empty-ico">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3 class="empty-title">No results found</h3>
            <p class="empty-desc">Try adjusting your search or filter criteria.</p>
            <button v-if="isFilteringForms" class="crm-clear-btn crm-clear-btn--lg mt-4" @click="clearFilters">Clear all filters</button>
          </div>

          <!-- 4. Has data — list or grid -->
          <div v-else-if="isFetched && enrichedForms.length > 0" class="forms-body">

            <!-- LIST VIEW -->
            <div v-if="viewMode === 'list'" class="list-table">
              <div class="list-body">
                <div
                  v-for="(form, idx) in paginatedForms"
                  :key="form.id"
                  class="list-row"
                  :style="{ animationDelay: idx * 0.035 + 's' }"
                >
                  <FormCard :form="form" class="list-row__fc" />
                </div>
              </div>
            </div>

            <!-- GRID VIEW -->
            <div v-else class="grid-view">
              <div
                v-for="(form, idx) in paginatedForms"
                :key="form.id"
                class="grid-cell"
                :style="{ animationDelay: idx * 0.045 + 's' }"
              >
                <FormCard :form="form" class="grid-fc" />
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPaginationPages > 1" class="crm-pager">
              <span class="pager-info">
                Showing <strong>{{ paginationStart }}–{{ paginationEnd }}</strong> of <strong>{{ enrichedForms.length }}</strong>
              </span>
              <div class="pager-controls">
                <button class="pg" :disabled="currentPaginationPage === 1" @click="goToPreviousPage">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <template v-for="p in displayedPages" :key="p">
                  <button v-if="p !== '...'" class="pg pg-n" :class="{ 'pg--on': p === currentPaginationPage }" @click="goToPage(p)">{{ p }}</button>
                  <span v-else class="pg-dots">…</span>
                </template>
                <button class="pg" :disabled="currentPaginationPage === totalPaginationPages" @click="goToNextPage">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            <!-- Loading more -->
            <div v-if="isLoadingMore" style="opacity:0.4;margin-top:8px">
              <FormCardSkeleton /><FormCardSkeleton />
            </div>

            <UpgradeBanner v-if="enrichedForms.length >= 2" class="mt-4" />
          </div>

          <template #fallback>
            <div class="list-table">
              <FormCardSkeleton v-for="n in 3" :key="n" />
            </div>
          </template>
        </ClientOnly>
      </section>

    </main>

    <div id="home-portals" class="z-20" />
  </div>
</template>

<script setup>
import { useFuse } from '@vueuse/integrations/useFuse'
import FormCard from '~/components/pages/home/FormCard.vue'
import FormCardSkeleton from '~/components/pages/home/FormCardSkeleton.vue'
import TrackClick from '~/components/global/TrackClick.vue'
import UpgradeBanner from "~/components/dashboard/UpgradeBanner.vue"

definePageMeta({
  middleware: ["auth"],
  layout: false,
})

useOpnSeoMeta({
  title: "Your Forms",
  description: "All of your CRMGO are here. Create new forms, or update your existing forms.",
})

const { current: workspace, currentId: workspaceId } = useCurrentWorkspace()

const {
  forms,
  isLoading: isFormsLoading,
  isFetchingNextPage: isLoadingMore,
  isFetched,
  currentPage,
  totalPages,
  isComplete,
} = useFormsList(workspaceId, {
  fetchAll: true,
  enabled: computed(() => import.meta.client && !!workspaceId.value),
})

// ── State ──────────────────────────────────────────────────────────────
const search            = ref("")
const debouncedSearch   = refDebounced(search, 500)
const selectedTags      = ref([])
const currentPaginationPage = ref(1)
const itemsPerPage      = 10
const viewMode          = ref("list")
const activeStatusFilter = ref("all")

// ── Methods ────────────────────────────────────────────────────────────
const clearFilters = () => {
  search.value = ""
  selectedTags.value = []
  activeStatusFilter.value = "all"
  currentPaginationPage.value = 1
}
const setStatusFilter = (key) => {
  activeStatusFilter.value = key
  currentPaginationPage.value = 1
}

// ── Computed ───────────────────────────────────────────────────────────
const isFilteringForms = computed(() =>
  (search.value !== "" && search.value !== null) ||
  selectedTags.value.length > 0 ||
  activeStatusFilter.value !== "all"
)

const allTags = computed(() => {
  if (!forms.value) return []
  const s = new Set()
  forms.value.forEach(f => { if (f.tags?.length) f.tags.forEach(t => s.add(t)) })
  return Array.from(s).sort()
})
const tagOptions = computed(() => allTags.value.map(tag => ({ label: tag, value: tag })))

// KPI counters
const activeCount    = computed(() => forms.value?.filter(f => f.status === 'active').length ?? 0)
const draftCount     = computed(() => forms.value?.filter(f => f.status === 'draft').length ?? 0)
const inactiveCount  = computed(() => forms.value?.filter(f => f.status !== 'active' && f.status !== 'draft').length ?? 0)
const totalResponses = computed(() => forms.value?.reduce((a, f) => a + (f.total_submissions || 0), 0) ?? 0)
const totalViews     = computed(() => forms.value?.reduce((a, f) => a + (f.total_views || 0), 0) ?? 0)

// Response trend: this month vs last month (based on form created_at + submissions)
const responseTrend = computed(() => {
  if (!forms.value?.length) return null
  const now = new Date()
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const thisMonth = forms.value
    .filter(f => f.created_at && new Date(f.created_at) >= startThisMonth)
    .reduce((a, f) => a + (f.total_submissions || 0), 0)
  const lastMonth = forms.value
    .filter(f => f.created_at && new Date(f.created_at) >= startLastMonth && new Date(f.created_at) < startThisMonth)
    .reduce((a, f) => a + (f.total_submissions || 0), 0)
  if (lastMonth === 0 && thisMonth === 0) return null
  if (lastMonth === 0) return { pct: 100, up: true }
  const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
  return { pct: Math.abs(pct), up: pct >= 0 }
})

const topResponseForms = computed(() => {
  if (!forms.value) return []
  return [...forms.value].sort((a, b) => (b.total_submissions || 0) - (a.total_submissions || 0)).slice(0, 5)
})
const maxResponses  = computed(() => Math.max(...topResponseForms.value.map(f => f.total_submissions || 0), 1))
const barRowWidth   = (val) => `${Math.max(((val || 0) / maxResponses.value) * 100, (val || 0) > 0 ? 4 : 2)}%`

// Donut
const donutC = parseFloat((2 * Math.PI * 28).toFixed(2))
const donutSegments = computed(() => {
  const total = forms.value?.length || 1
  return {
    active: parseFloat(((activeCount.value / total) * donutC).toFixed(2)),
    draft:  parseFloat(((draftCount.value  / total) * donutC).toFixed(2)),
  }
})

// Sparkline — decorative bars based on submissions of last 8 forms
const sparkHeights = computed(() => {
  if (!forms.value?.length) return Array(8).fill(20)
  const vals = forms.value.slice(-8).map(f => f.total_submissions || 0)
  const mx = Math.max(...vals, 1)
  return vals.map(v => Math.max(Math.round((v / mx) * 80), 8))
})

// Status tabs
const statusTabs = computed(() => [
  { key: "all",      label: "All",      count: forms.value?.length ?? 0 },
  { key: "active",   label: "Active",   count: activeCount.value },
  { key: "draft",    label: "Draft",    count: draftCount.value },
  { key: "inactive", label: "Inactive", count: inactiveCount.value },
])

// ── Base forms (status + tag filter) ──────────────────────────────────
const baseForms = computed(() => {
  if (!forms.value) return []
  return forms.value.filter(form => {
    // Status filter — skip when 'all'
    if (activeStatusFilter.value !== "all") {
      if (activeStatusFilter.value === "inactive") {
        if (form.status === "active" || form.status === "draft") return false
      } else {
        if (form.status !== activeStatusFilter.value) return false
      }
    }
    // Tag filter — skip when none selected
    if (selectedTags.value.length === 0) return true
    const sel = selectedTags.value.map(t => typeof t === 'string' ? t : t?.value).filter(Boolean)
    return form.tags?.length ? sel.every(t => form.tags.includes(t)) : false
  })
})

// ── Fuse search ────────────────────────────────────────────────────────
const { results: fuseResults } = useFuse(debouncedSearch, baseForms, {
  fuseOptions: {
    keys: ["title", "slug", "tags"],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: false,
  },
  matchAllWhenSearchEmpty: true,
})

// ── Enriched forms: fallback to base when search is empty ──────────────
const enrichedForms = computed(() => {
  const base = baseForms.value
  if (!base?.length) return []
  if (!debouncedSearch.value) return base   // ← KEY FIX: bypass fuse when no search
  const res = fuseResults.value
  return res?.length ? res.map(r => r.item) : []
})

// ── Pagination ─────────────────────────────────────────────────────────
const totalPaginationPages = computed(() => Math.ceil(enrichedForms.value.length / itemsPerPage))
const paginationStart      = computed(() => (currentPaginationPage.value - 1) * itemsPerPage + 1)
const paginationEnd        = computed(() => Math.min(currentPaginationPage.value * itemsPerPage, enrichedForms.value.length))
const paginatedForms       = computed(() => {
  const s = (currentPaginationPage.value - 1) * itemsPerPage
  return enrichedForms.value.slice(s, s + itemsPerPage)
})

const displayedPages = computed(() => {
  const total = totalPaginationPages.value, cur = currentPaginationPage.value, p = []
  if (total <= 7) { for (let i = 1; i <= total; i++) p.push(i) }
  else if (cur <= 4) { for (let i = 1; i <= 5; i++) p.push(i); p.push('...'); p.push(total) }
  else if (cur >= total - 3) { p.push(1); p.push('...'); for (let i = total - 4; i <= total; i++) p.push(i) }
  else { p.push(1); p.push('...'); for (let i = cur - 1; i <= cur + 1; i++) p.push(i); p.push('...'); p.push(total) }
  return p
})

const goToPage = (page) => {
  if (page !== '...' && page >= 1 && page <= totalPaginationPages.value) {
    currentPaginationPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
const goToNextPage = () => {
  if (currentPaginationPage.value < totalPaginationPages.value) {
    currentPaginationPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
const goToPreviousPage = () => {
  if (currentPaginationPage.value > 1) {
    currentPaginationPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

watch([search, selectedTags, activeStatusFilter], () => { currentPaginationPage.value = 1 })
</script>

<style scoped>
/* ── Tokens ─────────────────────────────────────────────────────────── */
.crm-root {
  --bg:        #f0f2f5;
  --surface:   #ffffff;
  --border:    #e4e8ef;
  --border2:   #d1d9e6;
  --tx:        #0d1117;
  --tx2:       #4a5568;
  --tx3:       #8a95a3;
  --accent:    #4f46e5;
  --accent-h:  #4338ca;
  --accent-bg: #eef2ff;
  --emerald:   #059669;
  --amber:     #d97706;
  --violet:    #7c3aed;
  --r-sm: 6px; --r-md: 10px; --r-lg: 14px;
  --sh-sm: 0 1px 3px rgba(13,17,23,.06), 0 1px 2px rgba(13,17,23,.04);
  --sh-md: 0 4px 12px rgba(13,17,23,.08), 0 1px 3px rgba(13,17,23,.05);
  --sh-lg: 0 12px 32px rgba(13,17,23,.10), 0 2px 8px rgba(13,17,23,.06);

  display: flex; flex-direction: column; min-height: 100vh;
  background: var(--bg);
  font-family: 'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif;
  color: var(--tx);
}

/* ── Header ─────────────────────────────────────────────────────────── */
.crm-header {
  background: var(--surface); border-bottom: 1px solid var(--border);
  box-shadow: var(--sh-sm); position: sticky; top: 0; z-index: 100;
}
.crm-header__inner {
  max-width: 1360px; margin: 0 auto; padding: 0 28px; height: 60px;
  display: flex; align-items: center; gap: 20px;
}
.crm-header__title-group { flex-shrink: 0; }
.crm-header__breadcrumb {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--tx3); font-weight: 500; margin-bottom: 2px;
}
.crm-header__breadcrumb-current { color: var(--tx2); }
.crm-header__h1 { font-size: 16px; font-weight: 800; letter-spacing: -.4px; line-height: 1; }

.crm-header__search-wrap { flex: 1; display: flex; align-items: center; gap: 8px; max-width: 520px; }
.crm-search-box { position: relative; flex: 1; }
.crm-search-ico { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--tx3); pointer-events: none; z-index: 1; }
.crm-search-input { padding-left: 32px !important; width: 100%; }

.crm-header__actions { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }

.crm-view-toggle { display: flex; background: #f1f4f8; border-radius: var(--r-sm); padding: 3px; gap: 2px; border: 1px solid var(--border); }
.crm-view-btn { width: 30px; height: 26px; border: none; background: transparent; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--tx3); transition: all .13s; }
.crm-view-btn:hover { color: var(--tx2); }
.crm-view-btn--on { background: var(--surface); color: var(--accent); box-shadow: 0 1px 3px rgba(0,0,0,.12); }

.crm-create-btn {
  background: var(--accent) !important; color: #fff !important; border: none !important;
  border-radius: var(--r-sm) !important; font-size: 13px !important; font-weight: 700 !important;
  padding: 8px 16px !important; box-shadow: 0 2px 8px rgba(79,70,229,.32) !important;
  transition: background .15s, box-shadow .15s, transform .12s !important;
}
.crm-create-btn:hover { background: var(--accent-h) !important; box-shadow: 0 4px 16px rgba(79,70,229,.4) !important; transform: translateY(-1px) !important; }

.crm-clear-btn {
  display: flex; align-items: center; gap: 5px;
  background: transparent; border: 1px solid var(--border2); border-radius: var(--r-sm);
  padding: 6px 11px; font-size: 12px; font-weight: 600; color: var(--tx2);
  cursor: pointer; transition: all .13s; font-family: inherit; white-space: nowrap;
}
.crm-clear-btn:hover { background: #fff4f4; color: #c0392b; border-color: #f5c6cb; }
.crm-clear-btn--lg { padding: 8px 16px; font-size: 13px; }

/* ── Main ───────────────────────────────────────────────────────────── */
.crm-main {
  flex: 1; max-width: 1360px; width: 100%; margin: 0 auto;
  padding: 24px 28px 40px; display: flex; flex-direction: column; gap: 18px;
}

/* ── KPI Strip ──────────────────────────────────────────────────────── */
.kpi-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 1.25fr 1.55fr;
  gap: 12px; align-items: stretch;
}
@media (max-width: 1140px) { .kpi-strip { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px)  { .kpi-strip { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px)  { .kpi-strip { grid-template-columns: 1fr; } }

.kpi-card {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg);
  padding: 15px 17px; box-shadow: var(--sh-sm);
  display: flex; align-items: center; gap: 13px;
  transition: box-shadow .18s; position: relative; overflow: hidden;
}
.kpi-card:hover { box-shadow: var(--sh-md); }
.kpi-card--accent::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--accent) 0%, #818cf8 100%);
  border-radius: var(--r-lg) var(--r-lg) 0 0;
}
.kpi-card--wide { flex-direction: column; align-items: flex-start; gap: 10px; padding: 14px 16px; }

.kpi-icon { width: 38px; height: 38px; border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-icon--blue    { background: #eff2ff; color: var(--accent); }
.kpi-icon--emerald { background: #ecfdf5; color: var(--emerald); }
.kpi-icon--violet  { background: #f5f3ff; color: var(--violet); }
.kpi-icon--amber   { background: #fffbeb; color: var(--amber); }

.kpi-body { flex: 1; min-width: 0; }
.kpi-num { font-size: 26px; font-weight: 800; line-height: 1; letter-spacing: -.8px; }
.kpi-lbl { font-size: 11px; font-weight: 700; color: var(--tx3); margin-top: 3px; text-transform: uppercase; letter-spacing: .5px; }
.kpi-lbl--top { font-size: 10.5px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .6px; }
.kpi-pill { font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
.kpi-pill--green { background: #d1fae5; color: #065f46; }
.kpi-trend { display: flex; align-items: center; gap: 3px; font-size: 11.5px; font-weight: 700; color: #059669; }
.kpi-trend--down { color: #dc2626; }
.kpi-sub { font-size: 11px; color: var(--tx3); font-weight: 500; }

.kpi-sparkline { display: flex; align-items: flex-end; gap: 3px; height: 30px; margin-left: auto; }
.kpi-spark { width: 4px; border-radius: 2px 2px 0 0; background: rgba(79,70,229,.22); min-height: 3px; }

/* Donut */
.donut-wrap { display: flex; align-items: center; gap: 14px; width: 100%; }
.donut-legend { display: flex; flex-direction: column; gap: 7px; flex: 1; }
.donut-row { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--tx2); font-weight: 500; }
.donut-row strong { margin-left: auto; font-weight: 700; color: var(--tx); font-size: 12px; }
.d-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; display: inline-block; }

/* Bar rows */
.bar-rows { display: flex; flex-direction: column; gap: 7px; width: 100%; }
.brow { display: flex; align-items: center; gap: 8px; }
.brow-lbl { font-size: 11px; color: var(--tx2); font-weight: 500; width: 68px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; }
.brow-track { flex: 1; height: 6px; background: #f0f2f7; border-radius: 3px; overflow: hidden; }
.brow-fill { height: 100%; background: linear-gradient(90deg, #a5b4fc 0%, var(--accent) 100%); border-radius: 3px; transition: width .6s ease; }
.brow-val { font-size: 11px; font-weight: 700; color: var(--tx2); width: 22px; text-align: right; flex-shrink: 0; }

/* ── Table Toolbar ──────────────────────────────────────────────────── */
.table-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);
  padding: 0 16px; height: 44px; box-shadow: var(--sh-sm);
}
.status-tabs { display: flex; height: 100%; }
.stab {
  display: flex; align-items: center; gap: 7px;
  height: 100%; padding: 0 14px; border: none; background: transparent;
  font-size: 13px; font-weight: 600; color: var(--tx3); cursor: pointer;
  border-bottom: 2px solid transparent; transition: all .13s; font-family: inherit; white-space: nowrap;
}
.stab:hover { color: var(--tx2); }
.stab--on { color: var(--accent); border-bottom-color: var(--accent); }
.stab-count {
  background: #f0f2f7; color: var(--tx3);
  font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; min-width: 20px; text-align: center;
}
.stab--on .stab-count { background: var(--accent-bg); color: var(--accent); }
.toolbar-total { font-size: 12px; color: var(--tx3); font-weight: 600; }

/* ── Forms section ──────────────────────────────────────────────────── */
.forms-section { display: flex; flex-direction: column; gap: 12px; }
.forms-body { display: flex; flex-direction: column; gap: 12px; }

/* LIST TABLE */
.list-table {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--sh-sm);
}
.list-head {
  display: grid;
  grid-template-columns: 1fr 110px 100px 90px 130px 48px;
  align-items: center; padding: 0 20px; height: 38px;
  background: #f8f9fb; border-bottom: 1px solid var(--border);
}
.th { font-size: 11px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .6px; }
.th--num  { text-align: center; }
.th--act  { text-align: right; }

.list-body { display: flex; flex-direction: column; }
.list-row { border-bottom: 1px solid #f3f5f9; animation: rowIn .22s ease-out both; }
.list-row:last-child { border-bottom: none; }
.list-row:hover { background: #fafbff; }
.list-row__fc { display: block; width: 100%; }

@keyframes rowIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

/* GRID */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
@media (max-width: 640px) { .grid-view { grid-template-columns: 1fr 1fr; } }
@media (max-width: 420px) { .grid-view { grid-template-columns: 1fr; } }

.grid-cell { animation: cardIn .26s ease-out both; }
@keyframes cardIn { from { opacity: 0; transform: scale(.96) translateY(8px); } to { opacity: 1; transform: none; } }

.grid-fc {
  height: 100%; border-radius: var(--r-lg) !important;
  border: 1px solid var(--border) !important; box-shadow: var(--sh-sm) !important;
  transition: box-shadow .18s, border-color .18s, transform .15s !important;
  overflow: hidden; background: var(--surface) !important;
}
.grid-fc:hover {
  box-shadow: var(--sh-lg) !important; border-color: #c7d2fe !important;
  transform: translateY(-3px) !important;
}

/* EMPTY */
.crm-empty {
  background: var(--surface); border: 1.5px dashed var(--border2);
  border-radius: var(--r-lg); padding: 68px 32px; text-align: center;
  display: flex; flex-direction: column; align-items: center;
}
.empty-ico {
  width: 66px; height: 66px; border-radius: 50%;
  background: var(--accent-bg); color: var(--accent);
  display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
}
.empty-title { font-size: 17px; font-weight: 800; margin-bottom: 8px; }
.empty-desc { font-size: 13.5px; color: var(--tx3); max-width: 360px; line-height: 1.6; }

/* PAGINATION */
.crm-pager {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);
  padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--sh-sm);
}
.pager-info { font-size: 12.5px; color: var(--tx3); }
.pager-info strong { color: var(--tx2); font-weight: 700; }
.pager-controls { display: flex; align-items: center; gap: 4px; }
.pg {
  min-width: 32px; height: 32px; padding: 0 8px; border-radius: var(--r-sm);
  border: 1px solid var(--border); background: var(--surface); cursor: pointer;
  font-size: 12.5px; font-weight: 600; color: var(--tx2);
  display: flex; align-items: center; justify-content: center; gap: 3px;
  transition: all .12s; font-family: inherit;
}
.pg:hover:not(:disabled) { background: var(--accent-bg); color: var(--accent); border-color: #c7d2fe; }
.pg--on { background: var(--accent); color: #fff; border-color: var(--accent); box-shadow: 0 2px 8px rgba(79,70,229,.28); }
.pg:disabled { opacity: .3; cursor: not-allowed; }
.pg-n { width: 32px; padding: 0; }
.pg-dots { font-size: 13px; color: var(--tx3); padding: 0 3px; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .crm-header__inner { padding: 0 16px; gap: 12px; }
  .crm-main { padding: 16px 16px 32px; }
  .list-head { display: none; }
}
</style>