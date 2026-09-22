import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import docentesRoutes from './routes/docentes.routes.js';
import materiasRoutes from './routes/materias.routes.js';
import authRoutes from './routes/auth.routes.js';
import perfilRoutes from './routes/perfil.routes.js';
import informesRoutes from './routes/informes.routes.js';
import adminRoutes from './routes/admin.routes.js';
import salasRoutes from './routes/salas.routes.js';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'sistema-informes-diarios-backend'});
});

app.get('/api', (_req, res) => {
  res.json({
    mensaje: 'API de Informes de Laboratorios funcionando',
  });
});
app.use('/api/docentes', docentesRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/informes', informesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/salas', salasRoutes);


app.listen(PORT, () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});
