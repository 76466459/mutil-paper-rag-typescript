import { readWordContent, readWordContentAsHTML } from '../src/utils/document-loader/WordLoader';
import { join } from 'path';

async function main() {
  const fileName = process.argv[2];
  
  if (!fileName) {
    console.error('请提供文件名，例如: tsx scripts/readWord.ts 文件名.docx');
    process.exit(1);
  }

  const filePath = join(process.cwd(), fileName);
  
  console.log(`📄 正在读取文档: ${fileName}\n`);
  console.log('='.repeat(80));
  
  try {
    // 读取纯文本内容
    const content = await readWordContent(filePath);
    console.log(content);
    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ 文档读取成功！共 ${content.length} 个字符\n`);
    
    // 可选：读取HTML格式
    // const htmlContent = await readWordContentAsHTML(filePath);
    // console.log('\n--- HTML 格式 ---\n');
    // console.log(htmlContent);
    
  } catch (error) {
    console.error('❌ 读取失败:', error);
    process.exit(1);
  }
}

main();
