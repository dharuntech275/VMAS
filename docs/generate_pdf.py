import os
import re
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    PageBreak,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print total page count: 'Page X of Y'.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        # Omit header and footer on cover page (page 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Header
        self.drawString(36, 756, "VMAS (VMA Services) — Technical Documentation")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 750, 576, 750)

        # Footer
        self.line(36, 45, 576, 45)
        self.drawString(36, 32, "Confidential & Proprietary • VMAS Platform")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 32, page_str)
        self.restoreState()


def parse_changelog(changelog_path):
    """
    Reads CHANGELOG.md and extracts step sections.
    """
    if not os.path.exists(changelog_path):
        return []

    with open(changelog_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by ## Step
    raw_steps = re.split(r'\n(?=## Step \d+)', content)
    parsed = []

    for chunk in raw_steps:
        if not chunk.strip().startswith('## Step'):
            continue

        lines = chunk.strip().split('\n')
        title = lines[0].replace('## ', '').strip()
        date = ""
        summary = ""
        files = []
        commands = []

        in_files = False
        in_commands = False

        for line in lines[1:]:
            sline = line.strip()
            if sline.startswith('* **Date:**'):
                date = sline.replace('* **Date:**', '').strip()
            elif sline.startswith('* **Summary:**'):
                summary = sline.replace('* **Summary:**', '').strip()
            elif sline.startswith('* **Files Created / Modified:**'):
                in_files = True
                in_commands = False
            elif sline.startswith('* **Run Commands:**'):
                in_files = False
                in_commands = True
            elif in_files and sline.startswith('- '):
                files.append(sline[2:].strip())
            elif in_commands and sline.startswith('```'):
                continue
            elif in_commands and sline:
                commands.append(sline)

        parsed.append({
            'title': title,
            'date': date,
            'summary': summary,
            'files': files,
            'commands': commands
        })

    return parsed


def generate_pdf():
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    changelog_path = os.path.join(docs_dir, "CHANGELOG.md")
    pdf_path = os.path.join(docs_dir, "VMAS_Documentation.pdf")

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Brand Colors
    c_banana = colors.HexColor('#14452F')
    c_turmeric = colors.HexColor('#F2B705')
    c_dark = colors.HexColor('#0F172A')
    c_slate = colors.HexColor('#334155')
    c_muted = colors.HexColor('#64748B')
    c_light_bg = colors.HexColor('#F8FAFC')
    c_border = colors.HexColor('#CBD5E1')

    # Typography Styles
    cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontSize=30,
        leading=36,
        textColor=c_banana,
        spaceAfter=10
    )

    cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        leading=18,
        textColor=c_muted,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontSize=16,
        leading=20,
        textColor=c_banana,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0F766E'),
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontSize=9,
        leading=13.5,
        textColor=c_slate,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeCustom',
        parent=styles['Code'],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0F172A'),
        backColor=c_light_bg,
        spaceAfter=5,
        borderPadding=5
    )

    story = []

    # ==========================================
    # COVER PAGE
    # ==========================================
    story.append(Spacer(1, 100))
    story.append(Paragraph("VMAS (VMA Services)", cover_title))
    story.append(Paragraph("Comprehensive Project Documentation & System Architecture", cover_subtitle))
    story.append(HRFlowable(width="100%", thickness=3, color=c_turmeric, spaceAfter=25))

    cover_details = [
        [Paragraph("<b>Project:</b>", body_style), Paragraph("VMAS Online Ready-Made Food Packs Delivery Platform", body_style)],
        [Paragraph("<b>Tech Stack:</b>", body_style), Paragraph("React (Vite) + Tailwind CSS v4 | Django REST Framework | Supabase (PostgreSQL)", body_style)],
        [Paragraph("<b>Architecture:</b>", body_style), Paragraph("Decoupled Frontend (Vite) & Backend (DRF) Monorepo", body_style)],
        [Paragraph("<b>Date:</b>", body_style), Paragraph(datetime.now().strftime("%B %d, %Y"), body_style)],
        [Paragraph("<b>Repository:</b>", body_style), Paragraph("github.com/dharuntech275/vmas", body_style)],
    ]
    cover_table = Table(cover_details, colWidths=[110, 430])
    cover_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F4F7F5')),
        ('BOX', (0,0), (-1,-1), 1, c_banana),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D1E0D8')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(cover_table)

    story.append(Spacer(1, 140))
    story.append(Paragraph("<i>Hot rotis at your door, ready to eat. Sold exclusively as family-friendly packs.</i>", body_style))
    story.append(PageBreak())

    # ==========================================
    # SECTION 1: PROJECT OVERVIEW
    # ==========================================
    story.append(Paragraph("1. Project Overview", h1_style))
    story.append(Paragraph(
        "<b>VMAS (VMA Services)</b> is an on-demand food delivery platform inspired by modern ordering apps (Swiggy/Zomato), "
        "designed specifically for freshly made, ready-to-eat bread packs rather than full restaurant meals. "
        "VMAS sells wholesome staple foods (Chapathi, Wheat Parotta, Plain Naan, and Poori) "
        "packaged exclusively in multi-piece family portions (e.g., Pack of 5, Pack of 4).",
        body_style
    ))
    story.append(Paragraph(
        "<b>Core Value Proposition:</b> Customers eliminate tedious dough kneading, rolling, and cooking. "
        "Breads are prepared fresh upon order placement and rushed hot to customer doorsteps.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 2: TECH STACK & DESIGN
    # ==========================================
    story.append(Paragraph("2. Tech Stack & Design System", h1_style))
    tech_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technology & Purpose</b>", body_style)],
        [Paragraph("<b>Frontend Framework</b>", body_style), Paragraph("React 19 + Vite (Fast HMR, optimized production bundler)", body_style)],
        [Paragraph("<b>Styling System</b>", body_style), Paragraph("Tailwind CSS v4 (Integrated via <code>@tailwindcss/vite</code> plugin)", body_style)],
        [Paragraph("<b>Routing & State</b>", body_style), Paragraph("React Router v7 + React Context API with <code>localStorage</code> synchronization", body_style)],
        [Paragraph("<b>Backend Framework</b>", body_style), Paragraph("Python 3.14 + Django 6 + Django REST Framework (DRF)", body_style)],
        [Paragraph("<b>Database</b>", body_style), Paragraph("Supabase PostgreSQL direct connection (SSL enforced: <code>sslmode=require</code>) with local SQLite fallback", body_style)],
        [Paragraph("<b>Production Server</b>", body_style), Paragraph("Gunicorn WSGI server + WhiteNoise static asset engine", body_style)],
        [Paragraph("<b>Brand Identity</b>", body_style), Paragraph("Banana-leaf green (<code>#14452F</code>), Turmeric gold (<code>#F2B705</code>), Off-white (<code>#FBFBFA</code>), Google Font <i>Bricolage Grotesque</i>, Light & Dark themes", body_style)],
    ]
    tech_table = Table(tech_data, colWidths=[130, 410])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 3: FOLDER STRUCTURE
    # ==========================================
    story.append(Paragraph("3. Monorepo Folder Structure", h1_style))
    folder_text = (
        "vmas/<br/>"
        "├── backend/             # Django REST Framework Backend<br/>"
        "│   ├── config/          # Project settings, URLs, WSGI, ASGI<br/>"
        "│   ├── menu/            # Menu items, serializers, seed commands, admin<br/>"
        "│   ├── orders/          # Orders, items, atomic checkout, tracking<br/>"
        "│   ├── requirements.txt # Python dependencies<br/>"
        "│   └── manage.py<br/>"
        "├── frontend/            # React + Vite Client Application<br/>"
        "│   ├── src/<br/>"
        "│   │   ├── api/client.js        # Generic fetch API client<br/>"
        "│   │   ├── components/          # Navbar, MenuCard, CartItem, Footer, StatusSteps<br/>"
        "│   │   ├── context/             # CartContext, ThemeContext, ToastContext<br/>"
        "│   │   ├── pages/               # Home, Menu, Cart, Checkout, TrackOrder, NotFound<br/>"
        "│   │   └── index.css            # Tailwind CSS v4 imports & theme tokens<br/>"
        "│   ├── vercel.json              # Vercel SPA deployment rules<br/>"
        "│   └── package.json<br/>"
        "├── docs/                # Project Documentation & Automated PDF Generator<br/>"
        "│   ├── CHANGELOG.md             # Step-by-step development history<br/>"
        "│   ├── generate_pdf.py          # ReportLab documentation builder<br/>"
        "│   └── VMAS_Documentation.pdf   # Generated comprehensive PDF<br/>"
        "├── .gitignore           # Excludes .env, venv, node_modules, sqlite3<br/>"
        "└── README.md            # Comprehensive project onboarding guide"
    )
    story.append(Paragraph(folder_text, code_style))
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 4: DATABASE MODELS
    # ==========================================
    story.append(Paragraph("4. Database Architecture & Models", h1_style))
    models_data = [
        [Paragraph("<b>Model Name</b>", body_style), Paragraph("<b>Fields, Types & Constraints</b>", body_style)],
        [
            Paragraph("<b>MenuItem</b><br/>(<code>menu app</code>)", body_style),
            Paragraph("• <code>name</code> (CharField 120)<br/>"
                      "• <code>slug</code> (SlugField 150, unique, auto-generated)<br/>"
                      "• <code>description</code> (TextField, optional)<br/>"
                      "• <code>pack_size</code> (CharField 50, e.g. 'Pack of 5')<br/>"
                      "• <code>price</code> (DecimalField 8,2 in INR ₹)<br/>"
                      "• <code>image</code> (URLField 500, direct URL only, no uploads)<br/>"
                      "• <code>is_available</code> (BooleanField, default=True)<br/>"
                      "• <code>created_at</code> (DateTimeField auto_now_add)", body_style)
        ],
        [
            Paragraph("<b>Order</b><br/>(<code>orders app</code>)", body_style),
            Paragraph("• <code>customer_name</code> (CharField 120)<br/>"
                      "• <code>phone</code> (CharField 15, validated 10-digit Indian mobile)<br/>"
                      "• <code>address</code> (TextField, minimum 8 characters)<br/>"
                      "• <code>payment_method</code> (Choices: <code>COD</code>, <code>UPI</code>)<br/>"
                      "• <code>status</code> (Choices: <code>RECEIVED</code>, <code>PREPARING</code>, <code>OUT_FOR_DELIVERY</code>, <code>DELIVERED</code>, <code>CANCELLED</code>)<br/>"
                      "• <code>total</code> (DecimalField 10,2, backend-calculated)<br/>"
                      "• <code>created_at</code> (DateTimeField auto_now_add)", body_style)
        ],
        [
            Paragraph("<b>OrderItem</b><br/>(<code>orders app</code>)", body_style),
            Paragraph("• <code>order</code> (ForeignKey to Order, on_delete=CASCADE, related_name='items')<br/>"
                      "• <code>menu_item</code> (ForeignKey to MenuItem, on_delete=PROTECT)<br/>"
                      "• <code>quantity</code> (PositiveIntegerField, validated 1 to 20)<br/>"
                      "• <code>unit_price</code> (DecimalField 8,2, price snapshot at time of checkout)<br/>"
                      "• <code>subtotal</code> (Computed property: quantity * unit_price)", body_style)
        ],
    ]
    models_table = Table(models_data, colWidths=[120, 420])
    models_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(models_table)
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 5: REST API ENDPOINTS
    # ==========================================
    story.append(Paragraph("5. REST API Specifications", h1_style))
    api_data = [
        [Paragraph("<b>Endpoint</b>", body_style), Paragraph("<b>Method</b>", body_style), Paragraph("<b>Description & Request / Response Schema</b>", body_style)],
        [
            Paragraph("<code>/api/menu/</code>", body_style),
            Paragraph("<b>GET</b>", body_style),
            Paragraph("Returns active available food packs (<code>is_available=True</code>).<br/>"
                      "<b>Response (200):</b> <code>[{\"id\": 1, \"name\": \"Chapathi\", \"pack_size\": \"Pack of 5\", \"price\": \"50.00\", ...}]</code>", body_style)
        ],
        [
            Paragraph("<code>/api/orders/</code>", body_style),
            Paragraph("<b>POST</b>", body_style),
            Paragraph("Places a new order atomically. Backend calculates total from DB rates.<br/>"
                      "<b>Request Body:</b> <code>{\"customer_name\": \"...\", \"phone\": \"9876543210\", \"address\": \"...\", \"payment_method\": \"COD\", \"items\": [{\"menu_item\": 1, \"quantity\": 2}]}</code><br/>"
                      "<b>Response (201):</b> <code>{\"id\": 1, \"status\": \"RECEIVED\", \"total\": \"200.00\", \"items\": [...]}</code>", body_style)
        ],
        [
            Paragraph("<code>/api/orders/&lt;id&gt;/?phone=...</code>", body_style),
            Paragraph("<b>GET</b>", body_style),
            Paragraph("Tracks live order status. Enforces phone security verification.<br/>"
                      "<b>Response (200):</b> Full order details with StatusSteps timeline.<br/>"
                      "<b>Response (404):</b> Returned when phone is missing or does not match.", body_style)
        ],
    ]
    api_table = Table(api_data, colWidths=[105, 50, 385])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 6: SETUP, RUN & DEPLOYMENT
    # ==========================================
    story.append(Paragraph("6. Setup, Run & Production Deployment Guide", h1_style))
    story.append(Paragraph(
        "<b>Local Development Execution:</b><br/>"
        "• Backend: <code>cd vmas/backend &amp;&amp; venv\\Scripts\\activate &amp;&amp; python manage.py runserver</code> (port 8000)<br/>"
        "• Frontend: <code>cd vmas/frontend &amp;&amp; npm run dev</code> (port 5173)<br/>"
        "• Automated Test Suite: <code>python manage.py test</code> (8 tests verify calculations & validations)",
        body_style
    ))
    story.append(Paragraph(
        "<b>Production Deployment Checklist:</b><br/>"
        "1. <b>Backend (Render / Railway):</b> Set environment variables (<code>SECRET_KEY</code>, <code>DEBUG=False</code>, <code>DB_*</code> for Supabase, <code>ALLOWED_HOSTS</code>, <code>CORS_ALLOWED_ORIGINS</code>). Build Command: <code>pip install -r requirements.txt &amp;&amp; python manage.py collectstatic --noinput &amp;&amp; python manage.py migrate &amp;&amp; python manage.py seed_menu</code>. Start Command: <code>gunicorn config.wsgi:application</code>.<br/>"
        "2. <b>Frontend (Vercel / Netlify):</b> Set <code>VITE_API_URL=https://your-backend.onrender.com/api</code>. Build Command: <code>npm run build</code>. Output directory: <code>dist</code>.<br/>"
        "3. <b>Static Assets:</b> WhiteNoise serves compressed assets directly from <code>STATIC_ROOT</code>.<br/>"
        "4. <b>Secrets Protection:</b> <code>.env</code> files and credentials strictly isolated via <code>.gitignore</code>.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 7: STEP-BY-STEP CHANGELOG
    # ==========================================
    story.append(Paragraph("7. Step-by-Step Implementation Changelog", h1_style))
    story.append(Paragraph("The following log is parsed from <code>CHANGELOG.md</code> detailing milestones from inception through deployment:", body_style))

    parsed_steps = parse_changelog(changelog_path)

    for item in parsed_steps:
        step_content = []
        step_content.append(Paragraph(f"<b>{item['title']}</b> ({item['date']})", h2_style))
        step_content.append(Paragraph(f"<b>Summary:</b> {item['summary']}", body_style))

        if item['files']:
            step_content.append(Paragraph(f"<b>Files:</b> {', '.join(item['files'])}", body_style))

        if item['commands']:
            step_content.append(Paragraph("<br/>".join(item['commands']), code_style))

        story.append(KeepTogether(step_content))
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Documentation PDF generated successfully at: {pdf_path}")


if __name__ == '__main__':
    generate_pdf()
