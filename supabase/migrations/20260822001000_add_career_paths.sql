-- Career path recommendations for TVET courses.
-- These rows are public learning guidance and can be expanded from Supabase.

CREATE TABLE IF NOT EXISTS public.career_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  career_title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  workplaces TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  certifications TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  related_competencies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT career_paths_course_title_unique UNIQUE (course_name, career_title)
);

ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view career paths" ON public.career_paths;
DROP POLICY IF EXISTS "Teachers and admins can manage career paths" ON public.career_paths;

CREATE POLICY "Anyone can view career paths"
ON public.career_paths
FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can manage career paths"
ON public.career_paths
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
  )
);

DROP TRIGGER IF EXISTS update_career_paths_updated_at ON public.career_paths;

CREATE TRIGGER update_career_paths_updated_at
  BEFORE UPDATE ON public.career_paths
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.career_paths (
  course_name,
  career_title,
  description,
  skills,
  workplaces,
  certifications,
  related_competencies
) VALUES
('ICT', 'IT Support Technician', 'Installs, maintains, and troubleshoots computers, software, printers, networks, and user accounts in organizations.', ARRAY['Computer maintenance', 'Operating systems', 'Networking basics', 'Customer support'], ARRAY['Schools and colleges', 'County offices', 'SMEs', 'ICT service firms'], ARRAY['CompTIA A+', 'Cisco IT Essentials', 'Google IT Support'], ARRAY['Diagnose computer faults', 'Install software', 'Provide user support']),
('ICT', 'Network Technician', 'Sets up and maintains LANs, routers, switches, wireless access points, and basic network security.', ARRAY['LAN setup', 'IP addressing', 'Router configuration', 'Cable testing'], ARRAY['ISPs', 'Data centers', 'Offices', 'Telecom contractors'], ARRAY['Cisco CCNA', 'MikroTik MTCNA', 'CompTIA Network+'], ARRAY['Configure network devices', 'Test connectivity', 'Secure local networks']),
('ICT', 'Junior Software Developer', 'Builds simple web, mobile, and database-backed applications for businesses and institutions.', ARRAY['HTML/CSS', 'JavaScript', 'Databases', 'Version control'], ARRAY['Software companies', 'Startups', 'Banks', 'Freelance clients'], ARRAY['freeCodeCamp', 'Microsoft Learn', 'Google Developer certificates'], ARRAY['Build user interfaces', 'Write program logic', 'Manage application data']),
('ICT', 'Cybersecurity Assistant', 'Supports basic security checks, account protection, vulnerability reporting, and safe ICT practices.', ARRAY['Security awareness', 'Access control', 'Incident reporting', 'Network monitoring'], ARRAY['Banks', 'Government offices', 'Managed IT providers', 'Schools'], ARRAY['CompTIA Security+', 'Cisco CyberOps Associate', 'ISC2 Certified in Cybersecurity'], ARRAY['Identify security threats', 'Apply access controls', 'Report incidents']),

('Electrical Engineering', 'Electrical Installation Technician', 'Installs, tests, and maintains wiring systems, lighting circuits, distribution boards, and electrical appliances.', ARRAY['Wiring', 'Circuit testing', 'Safety procedures', 'Drawing interpretation'], ARRAY['Construction sites', 'Factories', 'Facilities companies', 'Electrical contractors'], ARRAY['EPRA electrician license', 'NITA trade test', 'Solar PV short courses'], ARRAY['Install wiring systems', 'Test electrical circuits', 'Apply electrical safety']),
('Electrical Engineering', 'Solar PV Technician', 'Designs, installs, and maintains small solar power systems for homes, businesses, and institutions.', ARRAY['Solar sizing', 'Battery systems', 'Inverter setup', 'Fault diagnosis'], ARRAY['Solar companies', 'NGOs', 'Rural electrification projects', 'Energy contractors'], ARRAY['EPRA solar PV license', 'NITA solar training', 'Manufacturer certifications'], ARRAY['Size solar systems', 'Install PV modules', 'Maintain battery systems']),
('Electrical Engineering', 'Industrial Maintenance Technician', 'Maintains motors, control panels, sensors, and electrical systems used in production environments.', ARRAY['Motor control', 'PLC basics', 'Preventive maintenance', 'Troubleshooting'], ARRAY['Manufacturing plants', 'Processing factories', 'Warehouses', 'Utility firms'], ARRAY['PLC short course', 'NITA trade test', 'Electrical safety certification'], ARRAY['Maintain motors', 'Troubleshoot control circuits', 'Perform preventive maintenance']),

('Mechanical Engineering', 'Mechanical Maintenance Technician', 'Services machines, pumps, compressors, and production equipment to reduce breakdowns and downtime.', ARRAY['Machine maintenance', 'Lubrication', 'Technical drawing', 'Fault diagnosis'], ARRAY['Factories', 'Workshops', 'Processing plants', 'Maintenance contractors'], ARRAY['NITA trade test', 'Occupational safety training', 'Hydraulics and pneumatics short course'], ARRAY['Service mechanical systems', 'Read mechanical drawings', 'Diagnose machine faults']),
('Mechanical Engineering', 'Production Technician', 'Operates, monitors, and improves production machinery and workshop processes.', ARRAY['Machine operation', 'Quality control', 'Lean basics', 'Safety'], ARRAY['Manufacturing firms', 'Food processors', 'Packaging plants', 'Industrial workshops'], ARRAY['NITA trade test', 'ISO quality awareness', 'Machine operator certification'], ARRAY['Operate production equipment', 'Monitor quality', 'Apply workshop safety']),
('Mechanical Engineering', 'CAD Technician', 'Creates and edits technical drawings, part models, and fabrication layouts for engineering work.', ARRAY['CAD software', 'Measurement', 'Technical drawing', 'Design documentation'], ARRAY['Engineering consultancies', 'Fabrication shops', 'Manufacturers', 'Construction firms'], ARRAY['AutoCAD certificate', 'SolidWorks certificate', 'Technical drawing certification'], ARRAY['Create technical drawings', 'Model components', 'Interpret design specifications']),

('Building and Construction', 'Mason', 'Builds walls, foundations, floors, and other masonry structures using approved construction methods.', ARRAY['Masonry', 'Measurement', 'Mixing ratios', 'Site safety'], ARRAY['Construction sites', 'Contractors', 'Real estate developers', 'Self-employment'], ARRAY['NITA trade test', 'Site safety training', 'Construction supervision short course'], ARRAY['Lay blocks and bricks', 'Interpret drawings', 'Apply construction safety']),
('Building and Construction', 'Site Supervisor Assistant', 'Supports planning, coordination, material tracking, and quality checks on building sites.', ARRAY['Site coordination', 'Basic costing', 'Drawing interpretation', 'Quality checks'], ARRAY['Construction companies', 'County projects', 'Developers', 'Consultancies'], ARRAY['Construction management short course', 'OSHA/site safety', 'NCA worker registration'], ARRAY['Supervise site tasks', 'Track materials', 'Inspect workmanship']),
('Building and Construction', 'Quantity Surveying Assistant', 'Assists with measurements, bills of quantities, material estimates, and project cost records.', ARRAY['Taking off quantities', 'Cost estimation', 'Measurement', 'Excel'], ARRAY['Quantity surveying firms', 'Contractors', 'Real estate firms', 'Public works offices'], ARRAY['QS short course', 'Excel certification', 'Construction costing training'], ARRAY['Estimate materials', 'Prepare cost records', 'Measure construction work']),

('Automotive Engineering', 'Motor Vehicle Mechanic', 'Diagnoses, repairs, and services engines, brakes, suspension, transmission, and vehicle systems.', ARRAY['Engine service', 'Brake systems', 'Diagnostics', 'Workshop safety'], ARRAY['Garages', 'Dealerships', 'Fleet companies', 'Transport firms'], ARRAY['NITA motor vehicle trade test', 'Manufacturer training', 'Automotive diagnostics course'], ARRAY['Service vehicles', 'Diagnose faults', 'Repair mechanical systems']),
('Automotive Engineering', 'Auto Electrician', 'Repairs vehicle wiring, batteries, charging systems, lighting, sensors, and electronic faults.', ARRAY['Vehicle wiring', 'Battery systems', 'Sensor testing', 'Electrical diagnostics'], ARRAY['Garages', 'Dealerships', 'Fleet workshops', 'Auto electrical shops'], ARRAY['Auto electrical trade test', 'Diagnostics certification', 'Hybrid vehicle safety course'], ARRAY['Diagnose electrical faults', 'Repair wiring', 'Test charging systems']),
('Automotive Engineering', 'Fleet Maintenance Assistant', 'Tracks vehicle service schedules, inspection records, parts usage, and preventive maintenance tasks.', ARRAY['Maintenance planning', 'Record keeping', 'Basic mechanics', 'Safety inspection'], ARRAY['Logistics firms', 'Bus companies', 'County fleets', 'Delivery companies'], ARRAY['Fleet management short course', 'NITA trade test', 'Defensive driving awareness'], ARRAY['Plan maintenance', 'Inspect vehicles', 'Keep service records']),

('Hospitality and Catering', 'Chef or Cook', 'Prepares meals, manages kitchen hygiene, follows recipes, and supports food production in hospitality settings.', ARRAY['Food preparation', 'Menu planning', 'Hygiene', 'Kitchen safety'], ARRAY['Hotels', 'Restaurants', 'Catering firms', 'Institutions'], ARRAY['Food handlers certificate', 'NITA catering trade test', 'Culinary short courses'], ARRAY['Prepare meals', 'Maintain kitchen hygiene', 'Plan menus']),
('Hospitality and Catering', 'Front Office Assistant', 'Welcomes guests, manages reservations, handles basic records, and supports customer service.', ARRAY['Customer service', 'Reservation systems', 'Communication', 'Record keeping'], ARRAY['Hotels', 'Guest houses', 'Conference centers', 'Tourism businesses'], ARRAY['Customer care certificate', 'Hospitality operations course', 'First aid certificate'], ARRAY['Handle guests', 'Manage bookings', 'Communicate professionally']),
('Hospitality and Catering', 'Housekeeping Supervisor Assistant', 'Supports room preparation, laundry coordination, cleaning standards, and stock control.', ARRAY['Housekeeping standards', 'Stock control', 'Team coordination', 'Hygiene'], ARRAY['Hotels', 'Hospitals', 'Institutions', 'Facility management firms'], ARRAY['Housekeeping certificate', 'Occupational safety training', 'Customer service course'], ARRAY['Maintain rooms', 'Control linen and supplies', 'Inspect cleaning quality']),

('Fashion and Design', 'Fashion Designer Assistant', 'Supports garment design, pattern development, fabric selection, and production preparation.', ARRAY['Sketching', 'Pattern drafting', 'Fabric selection', 'Sewing'], ARRAY['Fashion houses', 'Tailoring shops', 'Textile firms', 'Self-employment'], ARRAY['NITA tailoring trade test', 'Pattern drafting certificate', 'Fashion design short course'], ARRAY['Draft patterns', 'Select fabrics', 'Construct garments']),
('Fashion and Design', 'Tailor or Dressmaker', 'Creates, alters, and repairs garments according to measurements, customer needs, and design specifications.', ARRAY['Measurement', 'Garment construction', 'Machine operation', 'Finishing'], ARRAY['Tailoring shops', 'Schools', 'Uniform suppliers', 'Self-employment'], ARRAY['NITA garment making trade test', 'Industrial sewing certificate', 'Entrepreneurship training'], ARRAY['Take measurements', 'Operate sewing machines', 'Finish garments']),
('Fashion and Design', 'Textile Production Assistant', 'Supports fabric cutting, stitching, quality inspection, and production line workflows.', ARRAY['Cutting', 'Industrial sewing', 'Quality control', 'Production workflow'], ARRAY['Textile factories', 'EPZ garment firms', 'Uniform manufacturers', 'Design studios'], ARRAY['Industrial sewing certificate', 'Quality control short course', 'NITA trade test'], ARRAY['Inspect garments', 'Support production', 'Operate textile equipment']),

('Plumbing', 'Plumber', 'Installs and repairs water supply, drainage, sanitation, and fixture systems in buildings.', ARRAY['Pipe fitting', 'Leak detection', 'Drainage systems', 'Blueprint reading'], ARRAY['Construction sites', 'Facility maintenance firms', 'Water companies', 'Self-employment'], ARRAY['NITA plumbing trade test', 'Water systems short course', 'Site safety training'], ARRAY['Install pipes', 'Repair leaks', 'Test plumbing systems']),
('Plumbing', 'Water Systems Technician', 'Maintains pumps, tanks, valves, meters, and small water distribution systems.', ARRAY['Pump maintenance', 'Valve operation', 'Water safety', 'System inspection'], ARRAY['Water utilities', 'Institutions', 'NGOs', 'County water projects'], ARRAY['Pump maintenance course', 'Water safety training', 'NITA trade test'], ARRAY['Maintain pumps', 'Inspect water systems', 'Apply safety procedures']),
('Plumbing', 'Sanitation Technician', 'Supports installation and maintenance of sanitation systems, drainage, and waste-water fixtures.', ARRAY['Sanitation systems', 'Drainage', 'Fixture installation', 'Health and safety'], ARRAY['Construction firms', 'Hospitals', 'Schools', 'County projects'], ARRAY['Sanitation short course', 'Plumbing trade test', 'Occupational safety training'], ARRAY['Install sanitation fixtures', 'Maintain drainage', 'Follow hygiene standards']),

('Welding and Fabrication', 'Welder', 'Joins metal parts using welding processes while following drawings, measurements, and safety standards.', ARRAY['Arc welding', 'Gas welding', 'Measurement', 'Workshop safety'], ARRAY['Fabrication workshops', 'Construction firms', 'Manufacturers', 'Repair yards'], ARRAY['NITA welding trade test', 'Welding safety certificate', 'AWS entry-level welding'], ARRAY['Join metal parts', 'Read fabrication drawings', 'Apply welding safety']),
('Welding and Fabrication', 'Metal Fabricator', 'Cuts, shapes, assembles, and finishes metal structures, gates, frames, tanks, and fittings.', ARRAY['Metal cutting', 'Assembly', 'Grinding and finishing', 'Technical drawing'], ARRAY['Fabrication shops', 'Construction sites', 'Agricultural equipment makers', 'Self-employment'], ARRAY['NITA fabrication trade test', 'Technical drawing certificate', 'Workshop safety training'], ARRAY['Fabricate metal structures', 'Use workshop tools', 'Finish metal products']),
('Welding and Fabrication', 'Quality Inspection Assistant', 'Checks weld quality, measurements, alignment, and surface finish against job specifications.', ARRAY['Inspection', 'Measurement tools', 'Defect identification', 'Documentation'], ARRAY['Manufacturers', 'Fabrication firms', 'Construction contractors', 'Inspection companies'], ARRAY['Welding inspection short course', 'Quality control training', 'Safety certification'], ARRAY['Inspect welds', 'Measure components', 'Document defects']),

('Business Management', 'Administrative Assistant', 'Supports office operations, records, communication, scheduling, and basic business processes.', ARRAY['Office administration', 'Communication', 'Record keeping', 'Computer applications'], ARRAY['SMEs', 'Schools', 'County offices', 'NGOs'], ARRAY['Microsoft Office certification', 'Customer care certificate', 'Records management course'], ARRAY['Manage records', 'Communicate professionally', 'Support office operations']),
('Business Management', 'Sales and Marketing Assistant', 'Supports customer acquisition, product promotion, market research, and sales records.', ARRAY['Sales communication', 'Digital marketing basics', 'Customer relationship management', 'Reporting'], ARRAY['Retail firms', 'Startups', 'Banks', 'Manufacturers'], ARRAY['Digital marketing certificate', 'Customer service training', 'Sales management short course'], ARRAY['Promote products', 'Handle customers', 'Track sales']),
('Business Management', 'Entrepreneur or Small Business Owner', 'Starts and manages a small business by handling operations, customers, finance, and growth planning.', ARRAY['Business planning', 'Basic accounting', 'Customer service', 'Marketing'], ARRAY['Self-employment', 'Retail businesses', 'Service businesses', 'Online commerce'], ARRAY['Entrepreneurship training', 'Basic bookkeeping certificate', 'Digital skills certificate'], ARRAY['Prepare business plans', 'Manage finances', 'Serve customers']),

('Agriculture', 'Farm Manager Assistant', 'Supports crop or livestock operations, farm records, input planning, and day-to-day supervision.', ARRAY['Crop production', 'Livestock basics', 'Record keeping', 'Farm planning'], ARRAY['Farms', 'Agribusinesses', 'Cooperatives', 'NGOs'], ARRAY['Good Agricultural Practices training', 'Agribusiness certificate', 'NITA agriculture trade test'], ARRAY['Manage farm records', 'Supervise farm tasks', 'Apply production practices']),
('Agriculture', 'Agribusiness Assistant', 'Supports marketing, value chain coordination, input sales, and customer service in agricultural enterprises.', ARRAY['Agribusiness', 'Marketing', 'Value chains', 'Customer service'], ARRAY['Agrovets', 'Cooperatives', 'Input suppliers', 'Produce buyers'], ARRAY['Agribusiness short course', 'Digital marketing certificate', 'Basic bookkeeping'], ARRAY['Market farm products', 'Advise customers', 'Track inventory']),
('Agriculture', 'Irrigation Technician', 'Installs, maintains, and troubleshoots drip, sprinkler, and pump-based irrigation systems.', ARRAY['Irrigation setup', 'Pump operation', 'Water management', 'Maintenance'], ARRAY['Farms', 'Irrigation projects', 'NGOs', 'Agricultural contractors'], ARRAY['Irrigation systems certificate', 'Pump maintenance course', 'Water management training'], ARRAY['Install irrigation systems', 'Maintain pumps', 'Manage water use']),

('Hairdressing and Beauty Therapy', 'Hairdresser', 'Provides hair cutting, styling, treatment, braiding, and salon customer care services.', ARRAY['Hair styling', 'Braiding', 'Hair treatment', 'Customer care'], ARRAY['Salons', 'Spas', 'Beauty schools', 'Self-employment'], ARRAY['NITA hairdressing trade test', 'Product training certificates', 'Customer service course'], ARRAY['Style hair', 'Treat hair', 'Serve salon clients']),
('Hairdressing and Beauty Therapy', 'Beauty Therapist', 'Provides skincare, manicure, pedicure, makeup, and wellness-related beauty services.', ARRAY['Skincare', 'Manicure and pedicure', 'Makeup', 'Hygiene'], ARRAY['Spas', 'Salons', 'Hotels', 'Self-employment'], ARRAY['Beauty therapy certificate', 'NITA trade test', 'Product safety training'], ARRAY['Perform beauty treatments', 'Maintain hygiene', 'Consult clients']),
('Hairdressing and Beauty Therapy', 'Salon Manager Assistant', 'Supports bookings, stock control, client service, hygiene standards, and daily salon operations.', ARRAY['Salon operations', 'Stock control', 'Customer service', 'Scheduling'], ARRAY['Salons', 'Spas', 'Beauty clinics', 'Training centers'], ARRAY['Salon management short course', 'Customer care certificate', 'Basic bookkeeping'], ARRAY['Manage appointments', 'Track products', 'Support salon operations'])
ON CONFLICT (course_name, career_title) DO UPDATE SET
  description = EXCLUDED.description,
  skills = EXCLUDED.skills,
  workplaces = EXCLUDED.workplaces,
  certifications = EXCLUDED.certifications,
  related_competencies = EXCLUDED.related_competencies,
  updated_at = now();
