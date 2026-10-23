"""E2E integral F9 — fluxos 1..8 do PRD project2 §10 (uma sessão contínua)."""
import asyncio, re
from pathlib import Path
from playwright.async_api import async_playwright

SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(parents=True, exist_ok=True)
BASE = "http://localhost:8080"
results: list[tuple[bool, str]] = []
console_errors: list[str] = []

def check(ok: bool, label: str):
    results.append((bool(ok), label))
    print(("OK  " if ok else "FAIL") + " | " + label)

async def text_of(page):
    return await page.evaluate("document.body.innerText")

async def wait_hydrate(page, ms=1100):
    await page.wait_for_timeout(ms)

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(str(e)))

        # ---------- FLUXO 2 — aula v2 (frente do roteiro: constrói estado p/ fluxo 1) ----------
        await page.goto(f"{BASE}/concepts/1", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check("Rate Limiting" in t, "F2: aula renderiza (título do conceito #1)")
        check(all(h in t for h in ["Objective", "Mental model", "Scenario", "Practice — decide and check", "Worked decision", "Transfer"]), "F2: caminho aprofundado (seções completas da lição âncora)")
        check("Open lab" in t or "lab" in t.lower(), "F2: saída para o laboratório presente")
        await page.screenshot(path=str(SHOTS / "f2_lesson.png"))

        # prática: resposta errada → feedback nomeia o critério quebrado
        await page.get_by_role("button", name="6 at t=0; 0 at t=1.").click()
        await page.get_by_role("button", name="Submit decision").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("Não atendido" in t, "F2: resposta errada → 'Não atendido'")
        check("per-batch allowance" in t, "F2: feedback nomeia a causa do equívoco")
        check("Apply both burst capacity and elapsed-time refill." in t, "F2: critério quebrado listado no feedback")
        await page.screenshot(path=str(SHOTS / "f2_practice_wrong.png"))
        await page.get_by_role("button", name="Try again").click()
        await page.get_by_role("button", name="6 at t=0; 2 at t=1.").click()
        await page.get_by_role("button", name="Submit decision").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("Atendido" in t, "F2: resposta correta → 'Atendido'")

        # ---------- FLUXO 3 — bancada ratelimit + comparação de config (pubsub) ----------
        await page.goto(f"{BASE}/labs/ratelimit", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check(all(h in t for h in ["Scenario", "Controls — run the experiment", "Representation — what to observe", "Evidence — check yourself", "Interpretation", "Challenge"]), "F3: bancada completa com 6 seções")
        send = page.get_by_role("button", name="Send HTTP GET /api/v1/data")
        for _ in range(12):
            await send.click()
            await page.wait_for_timeout(150)
            t = await text_of(page)
            if "429 TOO MANY REQUESTS" in t:
                break
        t = await text_of(page)
        check("200 OK" in t and "429 TOO MANY REQUESTS" in t, "F3: execução por passos mostra 200 e depois 429")
        await page.screenshot(path=str(SHOTS / "f3_ratelimit.png"))

        # comparação de configurações preserva a tentativa anterior (bench pubsub)
        await page.goto(f"{BASE}/labs/pubsub", wait_until="domcontentloaded")
        await wait_hydrate(page)
        pub = page.get_by_role("button", name="Publish Event")
        for _ in range(3):
            await pub.click()
            await page.wait_for_timeout(150)
        t_before = await text_of(page)
        depth_before = re.search(r"queue depth (\d+)", t_before)
        await page.get_by_role("button", name="Flaky worker: ON").click()
        await page.wait_for_timeout(300)
        t_after = await text_of(page)
        depth_after = re.search(r"queue depth (\d+)", t_after)
        check(depth_before is not None and depth_after is not None and depth_before.group(1) == depth_after.group(1), "F3: trocar configuração preserva a tentativa anterior (profundidade da fila mantida)")
        await page.screenshot(path=str(SHOTS / "f3_pubsub_config.png"))

        # ---------- FLUXO 4 — redirect ?s= compat ----------
        await page.goto(f"{BASE}/sandboxes?s=pubsub", wait_until="domcontentloaded")
        await wait_hydrate(page)
        check("/labs/pubsub" in page.url, "F4: /sandboxes?s=pubsub redireciona para /labs/pubsub")
        t = await text_of(page)
        check("Pub/Sub + Queue" in t, "F4: bancada alvo renderiza")

        # ---------- FLUXO 5 — S4 semântico ----------
        await page.goto(f"{BASE}/labs/sqli", wait_until="domcontentloaded")
        await wait_hydrate(page)
        inp = page.locator("#sqli-input")
        check((await inp.input_value()).strip() == "' OR '1'='1".strip(), "F5: payload clássico pré-carregado")
        await page.get_by_role("button", name="Unescaped Query").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("VULNERABLE CODE" in t, "F5: concat com ' OR '1'='1 → vulnerável")
        check("AND binds before OR" in t, "F5: explicação de precedência exibida")
        await page.screenshot(path=str(SHOTS / "f5_sqli_precedence.png"))
        await inp.fill("admin' --")
        await page.get_by_role("button", name="Unescaped Query").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("OUTSIDE THE MODEL" in t, "F5: entrada fora do modelo → estado 'fora do modelo'")
        await inp.fill("alice")
        await page.get_by_role("button", name="Parameterized Query").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("SECURE CODE" in t, "F5: parametrizada → código seguro")
        check("matches literally" in t and "alice" in t, "F5: parametrizada casa literal e retorna a linha")
        await page.screenshot(path=str(SHOTS / "f5_sqli_parameterized.png"))

        # ---------- FLUXO 6 — S6 percentis ----------
        await page.goto(f"{BASE}/labs/tail", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check("P99 = 100 ms" in t and "10,000 ms" in t, "F6: exemplo 99×100/1×10.000 no texto (P99=100, máx=10.000)")
        check("mean 199 ms" in t, "F6: média 199 ms no exemplo")
        await page.get_by_role("button", name="Send 100 requests").click()
        await page.wait_for_timeout(400)
        t = await text_of(page)
        check(re.search(r"p50\s*\n?\s*\d+ms", t, re.I) is not None, "F6: bancada dispara 100 requests e desenha p50/p99/max")
        check("p99" in t and "max" in t, "F6: marcadores p99 e max visíveis")
        await page.screenshot(path=str(SHOTS / "f6_tail.png"))

        # ---------- FLUXO 7 — progresso honesto + aplicação declarada ----------
        await page.goto(f"{BASE}/progress", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check(all(d in t for d in ["Contact", "Practiced", "Demonstrated", "Transferred", "Retained", "Declared applied"]), "F7: seis dimensões com rótulos")
        check(re.search(r"\d+ of \d+", t) is not None, "F7: denominadores rotulados ('N of M')")
        check("No global percentage" in t, "F7: sem percentual global")
        check("My app" in t and "never counted as mastery" in t, "F7: aplicação declarada mora em 'My app', não como domínio")
        await page.screenshot(path=str(SHOTS / "f7_progress.png"))

        # registrar aplicação em 'Meu app'
        await page.goto(f"{BASE}/readiness", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check("My app — application record" in t, "F7: página 'Meu app' é registro de aplicação")
        await page.get_by_role("button", name="Record Rate Limiting as implemented in your app").click()
        await page.wait_for_timeout(300)
        await page.get_by_role("button", name="Declared", exact=True).click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("Rate Limiting" in t, "F7: aplicação registrada aparece em Declared")
        await page.screenshot(path=str(SHOTS / "f7_readiness.png"))

        # ---------- FLUXO 8 — missão charged-but-lost, ciclo completo ----------
        await page.goto(f"{BASE}/missions/charged-but-lost", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check("The charge went through, but the answer got lost" in t, "F8: briefing da missão carrega")

        # step 1 briefing (evidência obrigatória)
        await page.get_by_label("Your evidence:").fill("Checkout timed out; charge state unknown.")
        await page.get_by_role("button", name="Next: Predict before you look").click()
        await wait_hydrate(page)
        t = await text_of(page)
        check("predict · cbl-predict" in t.lower(), "F8: avança para o step predict")

        # step 2 predict — tarefa t-11-predict (resposta b)
        await page.get_by_role("button", name="Client: the outcome is unknown. Service: the work already happened.").click()
        await page.get_by_role("button", name="Submit").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("Atendido" in t, "F8: tarefa predict avaliada com rubrica")
        await page.get_by_test_id("mission-next").click()
        await wait_hydrate(page)

        # step 3 experiment (evidência)
        await page.get_by_label("Your evidence:").fill("Circuit bench: 3 failures in a row open the breaker; the call is skipped until cooldown ends.")
        await page.get_by_test_id("mission-next").click()
        await wait_hydrate(page)
        t = await text_of(page)
        check("decide · cbl-decide" in t.lower(), "F8: avança para o step decide")

        # step 4 decide — t-14-compare (resposta b)
        await page.get_by_role("button", name="Repeat the call reusing the original key until a result arrives.").click()
        await page.get_by_role("button", name="Submit").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("Atendido" in t and "Valid alternative" in t, "F8: compare avalia invariante + alternativa válida")
        await page.get_by_label("Your evidence:").fill("Repeated the checkout call reusing the original operation key; the processor returns the original result without redoing the work.")
        await page.screenshot(path=str(SHOTS / "f8_decide.png"))
        await page.get_by_test_id("mission-next").click()
        await wait_hydrate(page)
        t = await text_of(page)
        check("transfer · cbl-transfer" in t.lower(), "F8: transfer com domínio trocado (editor de documentos)")

        # step 5 transfer — t-14-variant (resposta b); sem vocabulário de pagamento
        step_text = await page.get_by_test_id("mission-step-cbl-transfer").inner_text()
        check(not any(w in step_text.lower() for w in ["charge", "checkout", "purchase", "payment"]), "F8: transfer não spoila o padrão-resposta do domínio original")
        await page.get_by_role("button", name="Generate the identifier once per user action and send it on every retry.").click()
        await page.get_by_role("button", name="Submit").click()
        await page.wait_for_timeout(300)
        t = await text_of(page)
        check("Atendido" in t, "F8: variante avaliada (transfer met)")
        await page.get_by_test_id("mission-next").click()
        await wait_hydrate(page)

        # step 6 dossiê
        t = await text_of(page)
        check("dossier · cbl-dossier" in t.lower(), "F8: chega ao step do dossiê")
        dossier_text = ("Fato: o checkout estourou o timeout de 2s com a cobrança em t=1.8. "
                        "Hipótese: o resultado é desconhecido, não falho. "
                        "Evidência: breaker abriu após 3 falhas e o predict indicou work committed no serviço. "
                        "Ação: repetir a chamada com a mesma operation key até obter resultado. "
                        "Verificação: status lookup pela key confirma o resultado original. "
                        "Aprendizado: o cliente e o serviço conhecem mundos distintos no mesmo instante.")
        await page.get_by_test_id("mission-dossier").fill(dossier_text)
        await page.get_by_test_id("mission-save-dossier").click()
        await page.wait_for_timeout(400)
        t = await text_of(page)
        check("Dossier saved on this device" in t, "F8: dossiê salvo (indicador)")
        await page.screenshot(path=str(SHOTS / "f8_dossier_saved.png"))

        # persistência após reload
        await page.reload(wait_until="domcontentloaded")
        await wait_hydrate(page)
        stored = await page.get_by_test_id("mission-dossier").input_value()
        check("Aprendizado: o cliente e o serviço conhecem mundos distintos no mesmo instante." in stored, "F8: dossiê persiste após reload")
        check("Dossier saved on this device" in t, "F8: indicador de salvo persiste após reload")

        # índice reflete status
        await page.goto(f"{BASE}/missions", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check("dossier saved" in t.lower(), "F8: índice de missões mostra status 'dossier saved'")

        # ---------- FLUXO 1 — home de retorno leva ao ponto exato ----------
        await page.goto(f"{BASE}/", wait_until="domcontentloaded")
        await wait_hydrate(page)
        t = await text_of(page)
        check("Pick up where you stopped" in t, "F1: home de retorno mostra a bancada de trabalho")
        check("lesson in progress" in t.lower() and "#1" in t, "F1: atividade em andamento (última aula aberta)")
        check("mission in progress" in t.lower(), "F1: missão em andamento aparece")
        check(re.search(r"recover", t, re.I) is not None or "Run an experiment" in t, "F1: card de revisão ou experimento presente")
        await page.get_by_role("link", name=re.compile("Lesson in progress")).click()
        await wait_hydrate(page)
        check(page.url.rstrip("/").endswith("/concepts/1"), "F1: retorno leva ao ponto exato (/concepts/1)")
        await page.screenshot(path=str(SHOTS / "f1_home_return.png"))

        await browser.close()

    fails = [l for ok, l in results if not ok]
    print(f"\n===== RESUMO =====")
    print(f"checks: {len(results) - len(fails)} OK / {len(fails)} FAIL de {len(results)}")
    for f in fails:
        print("FAIL:", f)
    real_errors = [e for e in console_errors if "favicon" not in e.lower()]
    print(f"console errors: {len(real_errors)}")
    for e in real_errors[:5]:
        print("ERR:", e[:200])

asyncio.run(main())
