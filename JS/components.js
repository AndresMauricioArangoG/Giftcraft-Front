// mauro-header.html, css
// Renderiza componentes reutilizables (header/footer) en todas las páginas

function getBasePath() {
    const path = window.location.pathname || '';
    if (/\/HTML\//i.test(path)) {
        return '../';
    }
    return '';
}

function getComponentsBasePath() {
    // Las páginas están en la raíz o en /HTML/. Los componentes viven en /HTML/Components/.
    const path = window.location.pathname || '';
    if (/\/HTML\//i.test(path)) {
        return 'Components/';
    }
    return 'HTML/Components/';
}

function cargarComponente(id, archivo) {
    const url = getComponentsBasePath() + archivo;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`No se pudo cargar ${url} (${response.status})`);
            return response.text();
        })
        .then(data => {
            const contenedor = document.getElementById(id);
            if (contenedor) {
                contenedor.innerHTML = data;
                if (id === 'header-placeholder') {
                    ajustarRutasHeader(contenedor);
                    marcarActivoHeader(contenedor);
                }
            }
        })
        .catch(error => console.error('Error cargando componente:', error));
}

function ajustarRutasHeader(contenedor) {
    const enHtml = /\/HTML\//i.test(window.location.pathname || '');
    const prefix = enHtml ? '../' : '';
    contenedor.querySelectorAll('a[href^="/"]').forEach(a => {
        const href = a.getAttribute('href');
        a.setAttribute('href', prefix + href.replace(/^\/+/, ''));
    });
    contenedor.querySelectorAll('img[src^="/"]').forEach(img => {
        const src = img.getAttribute('src');
        img.setAttribute('src', prefix + src.replace(/^\/+/, ''));
    });
}

function marcarActivoHeader(contenedor) {
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    contenedor.querySelectorAll('.gc-menu .nav-link').forEach(link => {
        link.classList.remove('active');
        const linkFile = (new URL(link.href, window.location.href).pathname.split('/').pop() || 'index.html').toLowerCase();
        if (linkFile === current || (current === '' && linkFile === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function asegurarPlaceholder(id, posicion) {
    if (document.getElementById(id)) return;
    const div = document.createElement('div');
    div.id = id;
    if (posicion === 'footer') {
        document.body.appendChild(div);
    } else {
        document.body.insertBefore(div, document.body.firstChild);
    }
}

function cargarEstiloHeader() {
    const id = 'header-component-style';
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = getBasePath() + 'CSS/components/header.css';
        document.head.appendChild(link);
    }

    // Bootstrap Icons (necesario para los iconos del header)
    const iconsId = 'bootstrap-icons-cdn';
    if (!document.getElementById(iconsId) && !document.querySelector('link[href*="bootstrap-icons"]')) {
        const icons = document.createElement('link');
        icons.id = iconsId;
        icons.rel = 'stylesheet';
        icons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css';
        document.head.appendChild(icons);
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarEstiloHeader();
    asegurarPlaceholder('header-placeholder', 'header');
    asegurarPlaceholder('footer-placeholder', 'footer');

    cargarComponente('header-placeholder', 'header.html');
    cargarComponente('footer-placeholder', 'footer.html');
});
