from fpdf import FPDF
import re
import os

class PDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        font_path = 'C:/Windows/Fonts/msyh.ttc'
        # Check font file
        if os.path.exists('C:/Windows/Fonts/msyh.ttf'):
            font_path = 'C:/Windows/Fonts/msyh.ttf'
        elif os.path.exists('C:/Windows/Fonts/yahei.ttf'):
            font_path = 'C:/Windows/Fonts/yahei.ttf'
        self.add_font('CN', '', font_path)
        self.add_font('CN', 'B', font_path)
        self.set_auto_page_break(auto=True, margin=20)

    def header(self):
        if self.page_no() > 1:
            self.set_font('CN', '', 8)
            self.set_text_color(139, 123, 125)
            self.cell(0, 8, '我们的花园 - 使用说明书', 0, 1, 'C')
            self.set_draw_color(240, 228, 222)
            self.line(10, 15, 200, 15)
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('CN', '', 8)
        self.set_text_color(139, 123, 125)
        self.cell(0, 10, f'第 {self.page_no()} 页', 0, 0, 'C')

    def write_title(self, text):
        self.ln(4)
        self.set_font('CN', 'B', 20)
        self.set_text_color(232, 115, 74)
        self.multi_cell(0, 11, text, align='C')
        self.ln(2)

    def write_h1(self, text):
        self.ln(4)
        self.set_font('CN', 'B', 15)
        self.set_text_color(61, 44, 46)
        x = self.get_x()
        y = self.get_y()
        self.set_fill_color(232, 115, 74)
        self.rect(x, y, 3, 8, 'F')
        self.set_x(x + 5)
        self.multi_cell(0, 8, text)
        self.ln(2)

    def write_h2(self, text):
        self.ln(2)
        self.set_font('CN', 'B', 12)
        self.set_text_color(61, 44, 46)
        self.multi_cell(0, 7, text)
        self.ln(1)

    def write_h3(self, text):
        self.ln(1)
        self.set_font('CN', 'B', 10)
        self.set_text_color(232, 115, 74)
        self.multi_cell(0, 6, text)
        self.ln(1)

    def write_body(self, text):
        self.set_font('CN', '', 9.5)
        self.set_text_color(61, 44, 46)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def write_bullet(self, items):
        self.set_font('CN', '', 9.5)
        self.set_text_color(61, 44, 46)
        for item in items:
            if item.strip():
                self.set_x(15)
                self.multi_cell(0, 5.5, f'•  {item.strip()}')
        self.ln(1)

    def write_table(self, headers, rows):
        self.ln(2)
        if len(headers) == 0:
            return
        col_w = 180 / len(headers)
        # Header
        self.set_font('CN', 'B', 8.5)
        self.set_fill_color(232, 115, 74)
        self.set_text_color(255, 255, 255)
        for h in headers:
            self.cell(col_w, 8, h, 1, 0, 'C', True)
        self.ln()
        # Rows
        self.set_font('CN', '', 8.5)
        self.set_text_color(61, 44, 46)
        fill = False
        for row in rows:
            if self.get_y() > 260:
                self.add_page()
                self.set_font('CN', 'B', 8.5)
                self.set_fill_color(232, 115, 74)
                self.set_text_color(255, 255, 255)
                for h in headers:
                    self.cell(col_w, 8, h, 1, 0, 'C', True)
                self.ln()
                self.set_font('CN', '', 8.5)
                self.set_text_color(61, 44, 46)
            if fill:
                self.set_fill_color(255, 248, 245)
            else:
                self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                align = 'L' if i == 0 else 'C'
                self.cell(col_w, 7, str(cell), 1, 0, align, True)
            self.ln()
            fill = not fill
        self.ln(3)

    def write_divider(self):
        self.set_draw_color(240, 228, 222)
        y = self.get_y()
        self.line(10, y, 200, y)
        self.ln(4)

    def write_note(self, text):
        self.set_fill_color(255, 232, 221)
        self.set_font('CN', '', 8.5)
        self.set_text_color(210, 94, 53)
        y = self.get_y()
        self.rect(10, y, 190, 14, 'F')
        self.set_xy(14, y + 3)
        self.multi_cell(180, 5, f'💡 {text}')
        self.ln(5)


def main():
    md_file = 'README.md'
    output_file = '使用说明书.pdf'

    pdf = PDF()
    pdf.add_page()

    # ---- Title page ----
    pdf.ln(50)
    pdf.set_font('CN', 'B', 32)
    pdf.set_text_color(232, 115, 74)
    pdf.cell(0, 14, '我们的花园', 0, 1, 'C')
    pdf.ln(6)
    pdf.set_font('CN', 'B', 18)
    pdf.set_text_color(244, 162, 97)
    pdf.cell(0, 10, '情感维护工具使用说明书', 0, 1, 'C')
    pdf.ln(8)
    pdf.set_font('CN', '', 11)
    pdf.set_text_color(139, 123, 125)
    pdf.cell(0, 8, '属于两个人的情感小窝', 0, 1, 'C')
    pdf.ln(15)
    pdf.set_font('CN', '', 9)
    pdf.set_text_color(139, 123, 125)
    pdf.cell(0, 7, '版本 1.0 | 2026年5月', 0, 1, 'C')
    pdf.cell(0, 7, 'https://wangjundsg.github.io/home/', 0, 1, 'C')

    # ---- Read and parse README.md ----
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    pdf.add_page()
    skip_frontmatter = True
    in_table = False
    in_code = False
    table_headers = []
    table_rows = []
    bullet_list = []
    in_bullet = False

    i = 0
    while i < len(lines):
        line = lines[i].rstrip('\n')

        # Skip frontmatter (--- at start)
        if skip_frontmatter and line.strip() == '---':
            skip_frontmatter = False
            i += 1
            continue
        if skip_frontmatter:
            i += 1
            continue

        # Code fences
        if line.strip().startswith('```'):
            in_code = not in_code
            i += 1
            continue
        if in_code:
            i += 1
            continue

        # Tables
        if '|' in line and line.strip().startswith('|') and line.count('|') >= 3:
            if not in_table:
                in_table = True
                table_headers = [h.strip() for h in line.split('|') if h.strip()]
                table_rows = []
            else:
                if re.match(r'^[\s\|:\-]+$', line):
                    i += 1
                    continue
                cells = [c.strip() for c in line.split('|') if c.strip()]
                if cells:
                    table_rows.append(cells)
            i += 1
            continue
        else:
            if in_table and table_headers:
                pdf.write_table(table_headers, table_rows)
                table_headers = []
                table_rows = []
                in_table = False

        # Headings
        stripped = line.strip()
        if stripped.startswith('# '):
            # Flush bullets
            if bullet_list and in_bullet:
                pdf.write_bullet(bullet_list)
                bullet_list = []
                in_bullet = False
            pdf.write_title(stripped[2:])
        elif stripped.startswith('## '):
            if bullet_list and in_bullet:
                pdf.write_bullet(bullet_list)
                bullet_list = []
                in_bullet = False
            pdf.write_h1(stripped[3:])
        elif stripped.startswith('### '):
            if bullet_list and in_bullet:
                pdf.write_bullet(bullet_list)
                bullet_list = []
                in_bullet = False
            pdf.write_h2(stripped[4:])
        elif stripped.startswith('#### '):
            if bullet_list and in_bullet:
                pdf.write_bullet(bullet_list)
                bullet_list = []
                in_bullet = False
            pdf.write_h3(stripped[5:])

        # Bullets
        elif stripped.startswith('- ') or stripped.startswith('* '):
            bullet_list.append(stripped[2:])
            in_bullet = True

        # Divider
        elif stripped == '---':
            if bullet_list and in_bullet:
                pdf.write_bullet(bullet_list)
                bullet_list = []
                in_bullet = False
            pdf.write_divider()

        # Blockquote note
        elif stripped.startswith('> '):
            if bullet_list and in_bullet:
                pdf.write_bullet(bullet_list)
                bullet_list = []
                in_bullet = False
            pdf.write_note(stripped[2:])

        # Empty line
        elif stripped == '':
            if bullet_list and in_bullet:
                pdf.write_bullet(bullet_list)
                bullet_list = []
                in_bullet = False

        # Text
        else:
            if in_bullet:
                bullet_list.append(stripped)
                i += 1
                continue
            text = re.sub(r'\*\*(.+?)\*\*', r'\1', stripped)
            pdf.write_body(text)

        i += 1

    # Flush remaining
    if bullet_list and in_bullet:
        pdf.write_bullet(bullet_list)

    pdf.output(output_file)
    full_path = os.path.abspath(output_file)
    print(f'PDF 生成成功！')
    print(f'路径：{full_path}')
    print(f'大小：{os.path.getsize(output_file)} 字节')

if __name__ == '__main__':
    main()
