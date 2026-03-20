import numpy as np
import plotly.graph_objects as go

v_x0 = 1
v_y0 = 1
v_z0 = 1
omega = 2
y_0 = 0

t = np.linspace(0, 10, 1000)

x = (v_x0 / omega) * np.sin(omega * t) - (v_z0 / omega) * (1 - np.cos(omega * t))
y = v_y0 * t + y_0
z = (v_z0 / omega) * np.sin(omega * t) + (v_x0 / omega) * (1 - np.cos(omega * t))

fig = go.Figure(
    data=go.Scatter3d(
        x=x,
        y=y,
        z=z,
        mode="lines",
        line=dict(width=4)
    )
)

fig.update_layout(
    scene=dict(
        xaxis_title="x(t)",
        yaxis_title="y(t)",
        zaxis_title="z(t)"
    ),
    title="Modelisation of q(t)"
)

fig.show()
