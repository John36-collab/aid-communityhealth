-- Add write protection policies for nigeria_states_data table
-- This table contains reference data that should not be modified by regular users

CREATE POLICY "Prevent public inserts on nigeria_states_data" 
ON public.nigeria_states_data
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Prevent public updates on nigeria_states_data" 
ON public.nigeria_states_data
FOR UPDATE 
USING (false);

CREATE POLICY "Prevent public deletes on nigeria_states_data" 
ON public.nigeria_states_data
FOR DELETE 
USING (false);

-- Also add write protection for global_mental_health_data table
CREATE POLICY "Prevent public inserts on global_mental_health_data" 
ON public.global_mental_health_data
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Prevent public updates on global_mental_health_data" 
ON public.global_mental_health_data
FOR UPDATE 
USING (false);

CREATE POLICY "Prevent public deletes on global_mental_health_data" 
ON public.global_mental_health_data
FOR DELETE 
USING (false);