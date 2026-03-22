"""
Visualisations de la densité de probabilité |Φ_{n_x,n_z,k_y}(x,y,z,t)|^2
Hypothèses numériques : ħ=1, m=1, ω=1.
Génère PNG pour cas A (p_x=0,p_z=0) et cas B (p_x=1,p_z=0) et états (0,0),(1,0),(2,1).
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.special import eval_hermite, factorial
from mpl_toolkits.mplot3d import Axes3D
import plotly.graph_objects as go
import plotly.io as pio
import os

# --- Paramètres physiques et numériques ---
hbar = 1.0
m = 1.0
omega = 1.0

# grille pour x,z,y
x_min, x_max, nx = -5.0, 5.0, 200
z_min, z_max, nz = -5.0, 5.0, 200
y_min, y_max, ny = -5.0, 5.0, 200

x_vals = np.linspace(x_min, x_max, nx)
z_vals = np.linspace(z_min, z_max, nz)
y_vals = np.linspace(y_min, y_max, ny)

X2, Z2 = np.meshgrid(x_vals, z_vals, indexing='xy')  # pour cartes x-z

# constantes pour gamma
prefactor_gamma = np.sqrt(m * omega / hbar)

# normalisation standard de l'oscillateur harmonique 1D :
# N_n = (m ω / (π ħ))^{1/4} * 1/sqrt(2^n n!)
def N_n(n):
    return (m * omega / (np.pi * hbar))**0.25 / np.sqrt((2.0**n) * factorial(n))

# fonction d'onde 1D en variable x (ou z) selon gamma décalé
def psi_n_x(n, x, p_z=0.0):
    # gamma_x = sqrt(m ω / ħ) * ( x + p_z/(m ω) )
    gamma = prefactor_gamma * (x + p_z / (m * omega))
    Hn = eval_hermite(n, gamma)
    return N_n(n) * Hn * np.exp(-0.5 * gamma**2)

def psi_n_z(n, z, p_x=0.0):
    # gamma_z = sqrt(m ω / ħ) * ( z - p_x/(m ω) )
    gamma = prefactor_gamma * (z - p_x / (m * omega))
    Hn = eval_hermite(n, gamma)
    return N_n(n) * Hn * np.exp(-0.5 * gamma**2)

# densité totale (indépendante de y et t)
def density_xz(nx_state, nz_state, X, Z, p_x=0.0, p_z=0.0):
    psi_x = psi_n_x(nx_state, X, p_z=p_z)
    psi_z = psi_n_z(nz_state, Z, p_x=p_x)
    dens = (np.abs(psi_x)**2) * (np.abs(psi_z)**2)
    return dens

# paramètres des cas
cases = {
    'A': {'p_x': 0.0, 'p_z': 0.0, 'k_y': 1.0},
    'B': {'p_x': 1.0, 'p_z': 0.0, 'k_y': 1.0}
}

states = [(0,0), (1,0), (2,1)]

# dossier de sortie
outdir = "figures"
os.makedirs(outdir, exist_ok=True)

# --- 1) Cartes 2D x-z pour chaque cas et état ---
for case_label, params in cases.items():
    p_x = params['p_x']
    p_z = params['p_z']
    for (nx_state, nz_state) in states:
        D = density_xz(nx_state, nz_state, X2, Z2, p_x=p_x, p_z=p_z)
        fname = f"density_xz_case{case_label}_n{nx_state}_{nz_state}.png"
        plt.figure(figsize=(6,5))
        plt.contourf(X2, Z2, D, levels=100, cmap='plasma')
        plt.colorbar(label=r'$|\Phi|^2$')
        plt.xlabel('x')
        plt.ylabel('z')
        if case_label == "A":
            plt.title(f'$x-z$ plane ($x=0$) — $p_x = p_z = k_y = 0$, $n_x={nx_state}$, $n_z={nz_state}$')
        else:
            plt.title(f'$x-z$ plane ($x=0$) — $p_x = k_y = 1$, $p_z = 0$, $n_x={nx_state}$, $n_z={nz_state}$')
        plt.tight_layout()
        plt.savefig(os.path.join(outdir, fname), dpi=200)
        plt.close()

# --- 2) Coupes 1D superposées (pour comparaison) ---
# On trace |Φ(x,z=0)|^2 et |Φ(x=0,z)|^2 pour les trois états, pour chaque cas
for case_label, params in cases.items():
    p_x = params['p_x']
    p_z = params['p_z']

    # coupe en z=0 : densité en fonction de x
    z0 = 0.0
    plt.figure(figsize=(8,4))
    for (nx_state, nz_state) in states:
        psi_x = psi_n_x(nx_state, x_vals, p_z=p_z)
        psi_z0 = psi_n_z(nz_state, z0, p_x=p_x)
        dens_x = np.abs(psi_x)**2 * np.abs(psi_z0)**2
        plt.plot(x_vals, dens_x, label=f'$n_x={nx_state}$, $n_z={nz_state}$')
    plt.xlabel('$x$ ($z=0$)')
    plt.ylabel(r'$|\Phi(x,z=0)|^2$')
    if case_label == "A":
        plt.title(r'Cut in $x$ ($z=0$) — $p_x = p_z = k_y = 0$')
    else:
        plt.title(f'Cut in $x$ ($z=0$) — $p_x = k_y = 1$, $p_z = 0$')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(os.path.join(outdir, f'cuts_x_case{case_label}.png'), dpi=200)
    plt.close()

    # coupe en x=0 : densité en fonction de z
    x0 = 0.0
    plt.figure(figsize=(8,4))
    for (nx_state, nz_state) in states:
        psi_x0 = psi_n_x(nx_state, x0, p_z=p_z)
        psi_z = psi_n_z(nz_state, z_vals, p_x=p_x)
        dens_z = np.abs(psi_x0)**2 * np.abs(psi_z)**2
        plt.plot(z_vals, dens_z, label=f'$n_x={nx_state}$, $n_z={nz_state}$')
    plt.xlabel('$z$ ($x=0$)')
    plt.ylabel(r'$|\Phi(x=0,z)|^2$')
    if case_label == "A":
        plt.title(f'Cut in $z$ ($x=0$) — $p_x = p_z = k_y = 0$')
    else:
        plt.title(f'Cut in $x$ ($z=0$) — $p_x = k_y = 1$, $p_z = 0$')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(os.path.join(outdir, f'cuts_z_case{case_label}.png'), dpi=200)
    plt.close()

# --- 3) Plan x-y (z=0) : densité indépendante de y, on montre la constance en y ---
# On trace pour chaque état la carte x-y (z=0)
Xy, Yy = np.meshgrid(x_vals, y_vals, indexing='xy')
for case_label, params in cases.items():
    p_x = params['p_x']
    p_z = params['p_z']
    for (nx_state, nz_state) in states:
        # densité en z=0 : dens(x) * 1 (car |e^{ik_y y}|^2 = 1)
        psi_x = psi_n_x(nx_state, Xy, p_z=p_z)
        psi_z0 = psi_n_z(nz_state, 0.0, p_x=p_x)
        Dxy = (np.abs(psi_x)**2) * (np.abs(psi_z0)**2)
        fname = f"density_xy_case{case_label}_n{nx_state}_{nz_state}.png"
        plt.figure(figsize=(6,5))
        plt.contourf(Xy, Yy, Dxy, levels=80, cmap='plasma')
        plt.colorbar(label=r'$|\Phi|^2$')
        plt.xlabel('$x$')
        plt.ylabel('$y$')
        if case_label == "A":
            plt.title(f'$x-y$ plane ($z=0$) — $p_x = p_z = k_y = 0$, $n_x={nx_state}$, $n_z={nz_state}$')
        else:
            plt.title(f'$x-y$ plane ($z=0$) — $p_x = k_y = 1$, $p_z = 0$, $n_x={nx_state}$, $n_z={nz_state}$')
        plt.tight_layout()
        plt.savefig(os.path.join(outdir, fname), dpi=200)
        plt.close()

# --- 4) Isosurface 3D approximative (échantillonnage réduit pour performance) ---
# On échantillonne un cube [-5,5]^3 en 80^3 points (peut être lourd)
grid_n = 80
xs = np.linspace(-5,5,grid_n)
ys = np.linspace(-5,5,grid_n)
zs = np.linspace(-5,5,grid_n)
X3, Y3, Z3 = np.meshgrid(xs, ys, zs, indexing='xy')

# pour chaque cas et état, on calcule densité et trace isosurface
for case_label, params in cases.items():
    p_x = params['p_x']
    p_z = params['p_z']
    for (nx_state, nz_state) in states:
        # densité = |ψ_x(x)|^2 * |ψ_z(z)|^2 (indépendante de y)
        psi_x_3 = psi_n_x(nx_state, X3, p_z=p_z)
        psi_z_3 = psi_n_z(nz_state, Z3, p_x=p_x)
        D3 = (np.abs(psi_x_3)**2) * (np.abs(psi_z_3)**2)

        # choisir un seuil isovaleur (par ex 20% du max)
        iso_val = 0.2 * D3.max()

        # construire isosurface plotly
        fig = go.Figure(data=go.Isosurface(
            x=X3.flatten(),
            y=Y3.flatten(),
            z=Z3.flatten(),
            value=D3.flatten(),
            isomin=iso_val,
            isomax=D3.max(),
            surface_count=2,
            colorscale='Viridis',
            caps=dict(x_show=False, y_show=False, z_show=False)
        ))
        fig.update_layout(scene=dict(
            xaxis_title='x', yaxis_title='y', zaxis_title='z',
            aspectmode='cube'
        ), title=f'Isosurface |Φ|^2 case {case_label} n_x={nx_state} n_z={nz_state}')

        # sauvegarde statique PNG (nécessite kaleido ou orca)
        fname = os.path.join(outdir, f'isosurface_case{case_label}_n{nx_state}_{nz_state}.png')
        try:
            pio.write_image(fig, fname, width=800, height=700, scale=2)
        except Exception as e:
            # si l'export PNG échoue (kaleido non installé), sauvegarder HTML interactif en secours
            html_fname = os.path.join(outdir, f'isosurface_case{case_label}_n{nx_state}_{nz_state}.html')
            fig.write_html(html_fname)
            print(f"Export PNG isosurface échoué ({e}). HTML sauvegardé: {html_fname}")

# --- Vérification numérique de normalisation (sur x et z séparément) ---
# On vérifie que ∫|ψ_n(x)|^2 dx ≈ 1 pour quelques n
from numpy import trapezoid
print("Vérification normalisation 1D (intégrales sur x et z) :")
for n in [0,1,2]:
    psi = psi_n_x(n, x_vals)
    integral = trapezoid(np.abs(psi)**2, x_vals)
    print(f" n={n}  ∫|ψ_n(x)|^2 dx ≈ {integral:.6f}")

# --- Résumé des fichiers générés ---
generated_files = sorted(os.listdir(outdir))
print("\nFichiers générés dans le dossier:", outdir)
for f in generated_files:
    print(" -", f)

# Fin du script