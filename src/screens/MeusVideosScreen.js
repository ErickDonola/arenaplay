// ============================================================
// MeusVideosScreen.js — Arena Play Quadras
// Clips curtos gravados pelo usuário ao apertar o botão na quadra.
// Organizados em "pastas" por sessão (agendamento).
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import Colors from '../theme/colors';
import { s, fs } from '../theme/responsive';
import { videoSessoes } from '../data/mockData';

// ============================================================
// Componente de Pasta — representa uma sessão (agendamento)
// ============================================================
function PastaSessao({ sessao, onAbrirClip }) {
  const [aberta, setAberta] = useState(false);
  const totalClips = sessao.clips.length;
  const clipsDisponiveis = sessao.clips.filter((c) => c.disponivel).length;

  return (
    <View style={styles.pasta}>
      <TouchableOpacity
        style={[styles.pastaCabecalho, { borderLeftColor: sessao.cor }]}
        onPress={() => setAberta((prev) => !prev)}
        activeOpacity={0.8}
      >
        <View style={[styles.pastaIconeWrapper, { backgroundColor: sessao.cor + '22' }]}>
          <Text style={styles.pastaIcone}>{sessao.icone}</Text>
        </View>

        <View style={styles.pastaInfo}>
          <Text style={styles.pastaEsporte}>{sessao.esporte}</Text>
          <Text style={styles.pastaData}>
            📅 {sessao.data} às {sessao.horario} · 📍 {sessao.quadra}
          </Text>
          <Text style={styles.pastaClips}>
            🎬 {totalClips} clip{totalClips !== 1 ? 's' : ''}{' '}
            {clipsDisponiveis < totalClips
              ? `(${totalClips - clipsDisponiveis} processando)`
              : '· todos disponíveis'}
          </Text>
        </View>

        <Text style={styles.pastaSetaIcone}>{aberta ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {aberta && (
        <View style={styles.clipsContainer}>
          {sessao.clips.map((clip, index) => (
            <TouchableOpacity
              key={clip.id}
              style={[
                styles.clipItem,
                !clip.disponivel && styles.clipIndisponivel,
                index === sessao.clips.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() =>
                clip.disponivel
                  ? onAbrirClip(clip, sessao)
                  : Alert.alert('⏳ Processando', 'Este clip já vai aparecer!')
              }
              activeOpacity={0.75}
            >
              <View style={[styles.clipThumb, { backgroundColor: sessao.cor }]}>
                <Text style={styles.clipThumbIcone}>
                  {clip.disponivel ? '▶' : '⏳'}
                </Text>
              </View>

              <View style={styles.clipInfo}>
                <Text style={styles.clipTitulo} numberOfLines={1}>
                  {clip.titulo}
                </Text>
                <Text style={styles.clipDuracao}>⏱ {clip.duracao}</Text>
              </View>

              {clip.disponivel && (
                <TouchableOpacity
                  style={styles.clipBotaoBaixar}
                  onPress={() =>
                    Alert.alert('⬇ Download', `"${clip.titulo}" foi enviado para sua galeria.`)
                  }
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.clipBotaoBaixarIcone}>⬇</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================================
// Tela principal
// ============================================================
export default function MeusVideosScreen() {
  const [clipAberto, setClipAberto] = useState(null);
  const [sessaoAberta, setSessaoAberta] = useState(null);
  const [baixando, setBaixando] = useState(false);

  const handleBaixar = () => {
    if (baixando) return;
    setBaixando(true);
    Alert.alert('⬇ Download iniciado', `"${clipAberto.titulo}" será salvo na sua galeria.`);
    setTimeout(() => {
      setBaixando(false);
      Alert.alert('✅ Concluído', `"${clipAberto.titulo}" foi salvo na galeria.`);
    }, 3000);
  };

  const abrirClip = (clip, sessao) => {
    setClipAberto(clip);
    setSessaoAberta(sessao);
  };

  const fecharModal = () => {
    setClipAberto(null);
    setSessaoAberta(null);
    setBaixando(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoTexto}>
          📲 Aperte o botão de câmera na borda da quadra para gravar um clip de até 30s. Os clips ficam organizados por sessão aqui!
        </Text>
      </View>

      <FlatList
        data={videoSessoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PastaSessao sessao={item} onAbrirClip={abrirClip} />
        )}
        contentContainerStyle={{ padding: s(14), paddingBottom: s(24) }}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma sessão com vídeos ainda.</Text>
        }
      />

      <Modal
        visible={!!clipAberto}
        animationType="slide"
        transparent
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {clipAberto && sessaoAberta && (
              <ScrollView>
                <View style={[styles.player, { backgroundColor: sessaoAberta.cor }]}>
                  <Text style={styles.playerIcone}>{sessaoAberta.icone}</Text>
                  <Text style={styles.playerTexto}>▶ Reproduzindo clip...</Text>
                  <Text style={styles.playerSub}>
                    ⏱ {clipAberto.duracao} · {sessaoAberta.quadra}
                  </Text>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalTitulo}>{clipAberto.titulo}</Text>

                  <View style={styles.modalPastaRef}>
                    <Text style={styles.modalPastaIcone}>{sessaoAberta.icone}</Text>
                    <Text style={styles.modalPastaTexto}>
                      {sessaoAberta.esporte} · {sessaoAberta.data} às {sessaoAberta.horario}
                    </Text>
                  </View>

                  <View style={styles.modalMeta}>
                    <Text style={styles.modalMetaItem}>📅 {sessaoAberta.data} às {sessaoAberta.horario}</Text>
                    <Text style={styles.modalMetaItem}>⏱ Duração: {clipAberto.duracao}</Text>
                    <Text style={styles.modalMetaItem}>📍 {sessaoAberta.quadra}</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.botaoBaixar, baixando && styles.botaoBaixarAtivo]}
                    onPress={handleBaixar}
                    disabled={baixando}
                  >
                    <Text style={styles.botaoBaixarTexto}>
                      {baixando ? '⬇ Baixando...' : '⬇ Baixar Clip'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.botaoFechar} onPress={fecharModal}>
                    <Text style={styles.botaoFecharTexto}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  infoBox: {
    backgroundColor: Colors.secondary + '22',
    margin: s(14),
    marginBottom: 0,
    borderRadius: s(10),
    padding: s(10),
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  infoTexto: { fontSize: fs(11), color: Colors.textMedium, lineHeight: s(17) },
  vazio: { textAlign: 'center', marginTop: s(34), fontSize: fs(13), color: Colors.textLight },
  pasta: {
    backgroundColor: Colors.white,
    borderRadius: s(12),
    marginBottom: s(12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  pastaCabecalho: { flexDirection: 'row', alignItems: 'center', padding: s(12), borderLeftWidth: 4 },
  pastaIconeWrapper: { width: s(40), height: s(40), borderRadius: s(10), alignItems: 'center', justifyContent: 'center', marginRight: s(10) },
  pastaIcone: { fontSize: fs(20) },
  pastaInfo: { flex: 1 },
  pastaEsporte: { fontSize: fs(13), fontWeight: 'bold', color: Colors.textDark },
  pastaData: { fontSize: fs(10), color: Colors.textMedium, marginTop: s(2) },
  pastaClips: { fontSize: fs(10), color: Colors.primary, marginTop: s(3), fontWeight: '500' },
  pastaSetaIcone: { fontSize: fs(10), color: Colors.textLight, paddingLeft: s(6) },
  clipsContainer: { borderTopWidth: 1, borderTopColor: Colors.background },
  clipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(9),
    paddingHorizontal: s(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
    backgroundColor: Colors.white,
  },
  clipIndisponivel: { opacity: 0.5 },
  clipThumb: { width: s(34), height: s(34), borderRadius: s(7), alignItems: 'center', justifyContent: 'center', marginRight: s(10) },
  clipThumbIcone: { fontSize: fs(14), color: Colors.white },
  clipInfo: { flex: 1 },
  clipTitulo: { fontSize: fs(12), color: Colors.textDark, fontWeight: '500' },
  clipDuracao: { fontSize: fs(10), color: Colors.textLight, marginTop: s(2) },
  clipBotaoBaixar: { padding: s(5) },
  clipBotaoBaixarIcone: { fontSize: fs(16), color: Colors.secondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: Colors.white, borderTopLeftRadius: s(18), borderTopRightRadius: s(18), maxHeight: '90%' },
  player: { height: s(180), alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: s(18), borderTopRightRadius: s(18) },
  playerIcone: { fontSize: fs(40), marginBottom: s(6) },
  playerTexto: { color: Colors.white, fontSize: fs(14), fontWeight: 'bold' },
  playerSub: { color: 'rgba(255,255,255,0.75)', fontSize: fs(10), marginTop: s(4) },
  modalBody: { padding: s(16) },
  modalTitulo: { fontSize: fs(15), fontWeight: 'bold', color: Colors.textDark, marginBottom: s(5) },
  modalPastaRef: { flexDirection: 'row', alignItems: 'center', marginBottom: s(12) },
  modalPastaIcone: { fontSize: fs(12), marginRight: s(5) },
  modalPastaTexto: { fontSize: fs(11), color: Colors.textMedium },
  modalMeta: { backgroundColor: Colors.background, borderRadius: s(10), padding: s(12), gap: s(5), marginBottom: s(16) },
  modalMetaItem: { fontSize: fs(12), color: Colors.textDark },
  botaoBaixar: { backgroundColor: Colors.secondary, borderRadius: s(10), paddingVertical: s(12), alignItems: 'center', marginBottom: s(8) },
  botaoBaixarAtivo: { backgroundColor: Colors.textLight },
  botaoBaixarTexto: { color: Colors.white, fontSize: fs(14), fontWeight: 'bold' },
  botaoFechar: { backgroundColor: Colors.primary, borderRadius: s(10), paddingVertical: s(12), alignItems: 'center' },
  botaoFecharTexto: { color: Colors.white, fontSize: fs(14), fontWeight: 'bold' },
});
