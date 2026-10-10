# Media HORIZON DOME — lista do wgrania

Strona jest lokalnym demo. Poniższe pliki JPG/MP4 są celowo nieobecne: zastępują je istniejące SVG. Nie zmieniać nazw ani rozszerzeń. Nie zapisywać SVG pod rozszerzeniem JPG. Treść i zgody dotyczą JC Dome; uzyskać od Rity pisemną zgodę na konkretne materiały przed publikacją.

| Plik docelowy | Co ma przedstawiać | Orientacja / zalecany wymiar | Limit |
|---|---|---|---|
| `hero.mp4` | Powolny najazd dronem na kopułę JC Dome w otoczeniu; spokojne lewe pole pod tekst | poziom 16:9, 1920×1080; H.264, 8–10 s, bez dźwięku | ≤8 MB |
| `hero.jpg` | Kadr z hero, widoczna cała kopuła; temat bliżej prawej części, margines na przycięcie mobilne | poziom 16:9, 1920×1080 | ≤400 KB |
| `01.jpg` | Cała kopuła w otoczeniu; również duże zdjęcie w sekcji zastosowań | poziom 16:10, 1600×1000, bezpieczny centralny kadr | ≤400 KB |
| `02.jpg` | Dome House 4.5 m, widok z zewnątrz | pion 4:5, 1200×1500 | ≤400 KB |
| `03.jpg` | Dome House 5 m, widok z zewnątrz | pion 4:5, 1200×1500 | ≤400 KB |
| `04.jpg` | Dome House 6 m, widok z zewnątrz | pion 4:5, 1200×1500 | ≤400 KB |
| `05.jpg` | Połączone Dome House 4.5m+2.5m | pion 4:5, 1200×1500, obie części w kadrze | ≤400 KB |
| `06.jpg` | Wnętrze w dzień z widokiem przez panele | poziom 16:10, 1600×1000 | ≤400 KB |
| `07.jpg` | Wnętrze lub bryła po zmroku | poziom 16:10, 1600×1000 | ≤400 KB |
| `08.jpg` | Detal panelu, profil i łączenie | pion 4:5, 1200×1500 | ≤400 KB |
| `09.jpg` | Drzwi i człowiek pokazujący skalę | pion 4:5, 1200×1500 | ≤400 KB |
| `10.jpg` | Aranżacja stołu / ogrodu z katalogowym zastosowaniem | pion 4:5, 1200×1500 | ≤400 KB |
| `logo.svg` | Tymczasowo sam napis HORIZON DOME; docelowo wybrana jasna wersja logo | skalowalny, poziomy | zalecane ≤30 KB |
| `favicon.svg` | Tymczasowo znak wariantu 1 | kwadrat SVG | zalecane ≤10 KB |

## Działające zaślepki

`hero-placeholder.svg` oraz `01-placeholder.svg`–`10-placeholder.svg` są autorską, umowną grafiką geometryczną z ciemnym gradientem, nie zdjęciami produktów ani rysunkami technicznymi. Nie pokazują parametrów konstrukcji. Każde SVG ma tytuł „zdjęcie N”; widoczny podpis „Foto / Photo N” zachowuje języki NL/EN strony. Brak JPG uruchamia `onerror`; brak filmu zostawia nieruchomy obraz. Film ma osobny test postera i nie blokuje treści.

Po wgraniu prawdziwych plików uzupełnić opisy alternatywne `data-alt-nl` / `data-alt-en` i podpisy `data-nl` / `data-en` w `index.html`, po sprawdzeniu modelu i zgody. Placeholder `[DO UZUPEŁNIENIA]` zachowano w atrybutach `data-placeholder`; widoczny tekst jest tłumaczony, bo strona nie ma wersji PL.

## Uruchomienie i brakujące dane

Otwórz `../index.html` bezpośrednio z dysku. Wszystkie zasoby działają bez internetu; nie ma bibliotek, CDN ani pobieranych fontów. Skopiowanie całego folderu STRONA na hosting statyczny zachowuje ścieżki.

W `index.html` ustaw prawdziwy e-mail w `data-email` formularza oraz w jego `action="mailto:..."`, uzupełnij tekst kontaktu i telefonu w obu językach. Skrypt odczytuje `data-email`, otwiera `mailto:` z zakodowanym tematem i treścią; z placeholderem nie otwiera niedostarczalnej wiadomości. Nie ma backendu; wysyłkę wykonuje użytkownik we własnym programie pocztowym. Nie zapisujemy pól formularza w localStorage. Jedyny zapis to język.

Do potwierdzenia: e-mail, telefon, nazwiska i role założycieli, prawna tożsamość podmiotu w stopce, dane administratora oraz informacje zaznaczone w krótkiej sekcji Privacy. Dane produktowe: rejestr faktów, pozycje 1–18; modele: 11–14. Liczby osób przypisano wyłącznie do kolacji. Sprzedaż, montaż, transport, Eindhoven i rynki: potwierdzone odpowiedzi właściciela z 10.10.2026. Teksty NL wymagają korekty wskazanej przez właściciela osoby.

Demo ma `noindex, nofollow`. Ten znacznik nie zabezpiecza dostępu: ukryty link wymaga właściwego hostingu / kontroli dostępu. W tej rundzie przygotowano pliki; publikacja i domena nie zostały zmienione. Wspólne zasady projektu wskazują firmowy GitHub HOLISPHERE jako miejsce publikacji, a zadanie ogranicza zapis do lokalnych wyników.

10.10 21:14 — zadanie I: usunięto ze strony telefon, WhatsApp i wszystkie telefoniczne placeholdery; kontakt prowadzi przez e-mail lub formularz.
