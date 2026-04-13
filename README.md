# Human Elite Athlete (HEA) — Site vitrine

Site statique multi-pages pour Human Elite Athlete (HEA) : coaching personnel, camps d’entraînement, page explicative sur le football américain, galerie et contact.

## Pages

- `index.html` — Accueil
- `football.html` — Comprendre le football américain
- `coaching.html` — Coaching personnel
- `camps.html` — Camps d’entraînement
- `galerie.html` — Galerie (plein écran au clic)
- `contact.html` — Contact (formulaire mailto)

## Démarrer en local

Depuis ce dossier :

```bash
python -m http.server 8080
```

Puis ouvre :

- `http://localhost:8080/index.html`

## Structure

- `styles.css` — Styles (thème + animations)
- `script.js` — Interactions (menu mobile, reveal au scroll, lightbox, rotation d’images)
- `image hea/` — Images (logo + photos)

## Modifier les photos

- Ajoute/remplace des images dans `image hea/`
- Mets à jour les liens dans les pages HTML (ex: `data-hero-images` et les blocs galerie)
