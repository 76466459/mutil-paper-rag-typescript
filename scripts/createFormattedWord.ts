import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, convertInchesToTwip } from 'docx';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function createFormattedDocument() {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.98),    // 2.5cm
            bottom: convertInchesToTwip(0.98), // 2.5cm
            left: convertInchesToTwip(0.79),   // 2cm
            right: convertInchesToTwip(0.79),  // 2cm
          },
        },
      },
      children: [
        // 标题
        new Paragraph({
          text: '关于《解除劳动合同通知书》的异议声明及要求安排任务、支付工资的函',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          style: 'Title',
        }),

        // 函件编号
        new Paragraph({
          children: [
            new TextRun({ text: '函件编号：', bold: false }),
            new TextRun({ text: 'WS-20251223-001', bold: false }),
          ],
          spacing: { after: 100 },
        }),

        // 致
        new Paragraph({
          children: [
            new TextRun({ text: '致：', bold: false }),
            new TextRun({ text: '凯美瑞德（苏州）信息科技股份有限公司深圳分公司 HR 部门', bold: false }),
          ],
          spacing: { after: 100 },
        }),

        // 发函人信息
        new Paragraph({
          children: [new TextRun({ text: '发函人：魏爽', bold: false })],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '身份证号：411381199901146748', bold: false })],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '联系电话：[请填写你的手机号码]', bold: false })],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '日期：2025 年 12 月 23 日', bold: false })],
          spacing: { after: 300 },
        }),

        // 正文开头
        new Paragraph({
          text: '贵司 2025 年 12 月 22 日发送的《解除劳动合同通知书》已收悉。本人对贵司单方解除劳动合同的行为及所列理由均坚决否认；同时，本人于 2025 年 12 月 23 日正常到岗出勤，但未收到任何工作任务安排。现结合事实与法律郑重声明并函告如下：',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) }, // 2字符缩进
        }),

        // 一、坚决反对贵司单方解除劳动合同
        new Paragraph({
          children: [new TextRun({ text: '一、坚决反对贵司单方解除劳动合同，该行为构成违法解除', bold: true })],
          spacing: { before: 200, after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '本人与贵司签订了期限为 0.5 年的劳动合同（2025 年 8 月 6 日至 2026 年 2 月 5 日），劳动合同履行期间，本人始终恪守岗位职责、完成工作任务，不存在任何符合《劳动合同法》第 39 条规定的"严重违反规章制度"情形。',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '贵司在未与本人协商、未提供合法有效证据的情况下，单方作出解除劳动合同的决定，严重侵犯了本人的合法劳动权益，属于违法解除。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 二、所谓"不遵守考勤纪律"无任何事实依据
        new Paragraph({
          children: [new TextRun({ text: '二、所谓"不遵守考勤纪律"无任何事实依据，贵司需依法举证', bold: true })],
          spacing: { before: 200, after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '（一）公司明确约定弹性打卡，本人考勤符合标准', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '入职后，贵司已向部门所有员工明确告知实行"弹性上班打卡"制度，本人自始至终严格按照该约定履行出勤义务。前 4 个月与后续考勤模式完全一致，贵司均按全额工资足额发放薪酬，从未就考勤问题提出过任何异议，足以证明本人考勤符合公司管理标准。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '（二）贵司主张考勤违规，需提供完整合法证据', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '依据"谁主张、谁举证"的法律原则，若贵司坚持认为本人存在考勤违规，需在收到本函后 3 个工作日内，提供以下具体证据（口头陈述、模糊记录均无效）：',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 每一次考勤违规的精确日期、具体时长、原始考勤数据（如考勤系统后台原始截图、打卡设备生成的时间戳记录、本人签字确认的纸质考勤表等）；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 该违规行为对应的《员工手册》或考勤制度具体条款（需明确条款编号及原文，且证明该制度已依法告知本人）；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 排除"弹性打卡"适用的合法依据（需证明本人所谓"违规"不属于弹性打卡允许的合理范围）。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '（三）本人加班记录印证工作合规性', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '工作日期间，本人多次存在晚上加班的情况，相关加班记录（如 git 代码提交记录、工作沟通记录等）均可佐证本人积极履行工作义务，不存在"不遵守考勤纪律"进而影响工作的情形。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 三、"经多次提醒未改善"纯属虚构
        new Paragraph({
          children: [new TextRun({ text: '三、"经多次提醒未改善"纯属虚构，系对本人工作成果的否定', bold: true })],
          spacing: { before: 200, after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '贵司在通知书中声称"经多次提醒未改善"，完全与事实不符：',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 截至收到解除通知之日，本人从未收到过贵司任何关于考勤违规的书面提醒、警告函、整改通知等正式文件；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 所谓"提醒"若为口头形式（包括微信口头提及、会议口头告知），均无具体违规事实指向、无明确整改要求、无制度后果告知，且未形成"多次"（至少 2 次及以上）的有效记录。',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '本人在职期间，始终认真完成各项工作任务，加班加点推进项目，工作成果获得同事认可。贵司以虚构的"多次提醒未改善"为由解除合同，实质是对本人工作成果的无端否定，严重损害本人职业声誉。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 四、本人不存在"严重违反公司规章制度"的情形
        new Paragraph({
          children: [new TextRun({ text: '四、本人不存在"严重违反公司规章制度"的情形', bold: true })],
          spacing: { before: 200, after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '贵司主张本人"严重违反公司规章制度"，但未明确具体违反的制度条款、具体事实及法律依据。如前所述，本人考勤符合"弹性打卡"约定，无有效证据证明存在违规；工作中无任何迟到、早退、旷工、消极怠工等违反规章制度的行为，更不存在"严重违反"的情形。',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '贵司该主张无任何事实支撑，不能作为解除劳动合同的合法依据。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 五、要求贵司立即安排工作任务
        new Paragraph({
          children: [new TextRun({ text: '五、要求贵司立即安排工作任务并明确工资支付标准', bold: true })],
          spacing: { before: 200, after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '本人于 2025 年 12 月 23 日按正常工作时间到岗出勤（附打卡记录/工位待命照片为证），但截至发函时未收到贵司任何形式的工作任务安排。依据《劳动合同法》第 29 条"用人单位与劳动者应当按照劳动合同的约定，全面履行各自的义务"，现提出以下要求：',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 请贵司在收到本函后 1 个工作日内，通过书面形式（邮件/纸质通知）向本人分配与岗位职责相符的具体工作任务（如项目开发、文档撰写、系统维护等）；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 若贵司短期内确实无工作任务可安排，需与本人协商一致并签订书面《待岗协议》，明确待岗期间工资标准（不低于劳动合同约定的 13,000 元/月）、待岗期限及恢复工作的条件；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 自 2025 年 12 月 23 日起，无论是否安排工作任务，贵司需按本人原工资标准（13,000 元/月）足额支付工资，不得克扣、拖欠或降低标准，上述工资与 2025 年 12 月正常工资一并发放。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 六、本人合法诉求及沟通意愿说明
        new Paragraph({
          children: [new TextRun({ text: '六、本人合法诉求及沟通意愿说明', bold: true })],
          spacing: { before: 200, after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '为妥善解决争议，本人本着平等协商的原则，现明确以下诉求及沟通前提：',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '（一）举证要求', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '请贵司在收到本函后 3 个工作日内，就《解除劳动合同通知书》所列"不遵守考勤纪律、经多次提醒未改善"的主张，提供完整合法的证据（具体包括：每一次考勤违规的精确日期、时长、原始考勤数据，对应的制度条款及告知凭证，多次提醒的书面记录等）。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '（二）撤销解除通知', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '若贵司无法提供有效证据，请立即撤销 2025 年 12 月 22 日作出的《解除劳动合同通知书》，恢复双方劳动关系并继续履行原劳动合同。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '（三）经济补偿要求', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '若双方协商后未能恢复劳动关系，或贵司仍坚持解除，请在 3 个工作日内足额支付以下款项：',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 违法解除劳动合同赔偿金：13,000 元（计算方式：2N，N = 0.5 个月 × 13,000 元/月）',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 未休年假工资：597.69 元（计算方式：1 天 × 13,000 元 ÷ 21.75 天）',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 未休调休假工资：597.69 元（计算方式：1 天 × 13,000 元 ÷ 21.75 天）',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '（四）离职证明要求', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '无论争议最终如何解决，请贵司在 15 日内出具符合《劳动合同法实施条例》第 24 条规定的离职证明（仅载明劳动合同期限、工作岗位、离职日期，不得添加任何主观负面评价），以免影响本人后续职业发展。',
          spacing: { after: 300, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 结语
        new Paragraph({
          text: '本人始终愿意与贵司通过友好协商的方式化解分歧，上述诉求均基于合法合规及公平合理原则提出。若贵司未在上述期限内回应举证要求、未安排工作任务、未明确工资支付承诺，或未能就争议解决方案与本人达成一致，本人将通过向深圳市劳动人事争议仲裁委员会申请仲裁、向劳动监察部门投诉等合法途径维护自身权益（包括但不限于主张赔偿金、拖欠工资、未休假期工资及逾期支付的加付赔偿金），请贵司予以重视并积极配合。',
          spacing: { after: 300, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 附件清单
        new Paragraph({
          children: [new TextRun({ text: '附件清单：', bold: true })],
          spacing: { before: 200, after: 100 },
        }),

        new Paragraph({
          text: '1. 2025 年 12 月 23 日到岗打卡截图/工位待命照片（复印件）',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 本人加班记录截图（git 代码提交记录等，复印件）',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 前 4 个月工资流水截图（复印件）',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '4. 本人身份证复印件（签字按手印）',
          spacing: { after: 400, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        // 签名栏
        new Paragraph({
          text: '函件人（手写签名）：__________________',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: '日期（手写）：2025 年 12 月 23 日',
          spacing: { after: 100 },
        }),

        // 分页符，使用说明放在新页
        new Paragraph({
          text: '',
          pageBreakBefore: true,
        }),

        // 使用说明标题
        new Paragraph({
          text: '【使用说明】',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          run: {
            bold: true,
            size: 32, // 小二号
            font: '宋体',
          },
        }),

        // 使用说明内容
        new Paragraph({
          children: [new TextRun({ text: '一、填写要求', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 请将文档中 "[请填写你的手机号码]" 替换为你的实际手机号码；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 打印后在 "函件人（手写签名）" 处手写签名；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 在 "日期（手写）" 处手写填写实际发函日期。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '二、附件准备', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '所有附件复印件需签字确认，身份证复印件额外按手印。具体要求：',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 2025 年 12 月 23 日到岗打卡截图/工位待命照片（复印件）— 在复印件空白处签字；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 本人加班记录截图（git 代码提交记录等，复印件）— 在复印件空白处签字；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 前 4 个月工资流水截图（复印件）— 在复印件空白处签字；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '4. 本人身份证复印件 — 在复印件空白处签字并按手印（红色印泥）。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '三、邮寄方式', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 将函件正本及所有附件复印件装入信封；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 建议使用 EMS 或顺丰快递，选择 "签收回执" 服务；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 收件地址：凯美瑞德（苏州）信息科技股份有限公司深圳分公司 HR 部门；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '4. 保留快递单号及签收回执，作为送达证据。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '四、后续证据留存', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '发函后，每日出勤需及时补充留存以下证据，作为工资主张的依据：',
          spacing: { after: 100, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 每日打卡记录截图（含日期、时间、地点）；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 工位待命照片（建议每日上午、下午各拍摄一张，照片需显示日期时间）；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 向主管或 HR 申请工作任务的沟通记录（邮件、微信截图等）；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '4. 公司未安排工作任务的证据（如邮件未回复、微信未回复等）；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '5. 其他能证明本人正常出勤、公司未安排工作的证据。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          children: [new TextRun({ text: '五、重要提示', bold: true })],
          spacing: { after: 100 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '1. 本函件发出后，请保留一份完整副本（含所有附件）作为备份；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '2. 建议同时通过公司邮箱发送电子版函件，保留发送记录；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '3. 如公司在 3 个工作日内未回应，建议咨询专业劳动法律师；',
          spacing: { after: 50, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),

        new Paragraph({
          text: '4. 所有证据材料请妥善保管，后续仲裁或诉讼时需要提供。',
          spacing: { after: 200, line: 360 },
          indent: { firstLine: convertInchesToTwip(0.28) },
        }),
      ],
    }],
    styles: {
      default: {
        document: {
          run: {
            font: '宋体',
            size: 24, // 小四号 = 12pt = 24 half-points
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5倍行距
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Title',
          name: 'Title',
          basedOn: 'Normal',
          run: {
            font: '宋体',
            size: 44, // 二号 = 22pt = 44 half-points
            bold: true,
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          },
        },
      ],
    },
  });

  return doc;
}

async function main() {
  console.log('📝 正在生成格式化的 Word 文档...\n');
  
  const doc = await createFormattedDocument();
  const buffer = await Packer.toBuffer(doc);
  
  const outputPath = join(process.cwd(), '优化后的函件-格式化版.docx');
  await writeFile(outputPath, buffer);
  
  console.log('✅ 文档生成成功！');
  console.log(`📄 已保存到: 优化后的函件-格式化版.docx\n`);
  console.log('格式设置：');
  console.log('  ✓ 页面：A4 纸张');
  console.log('  ✓ 页边距：上下 2.5cm，左右 2cm');
  console.log('  ✓ 标题：宋体二号加粗居中');
  console.log('  ✓ 正文：宋体小四，1.5 倍行距');
  console.log('  ✓ 首行缩进：2 字符');
  console.log('  ✓ 一级标题：加粗');
  console.log('  ✓ 二级标题：加粗');
  console.log('  ✓ 三级标题：正常');
  console.log('\n💡 可以直接在 Word 中打开并打印！');
}

main();
